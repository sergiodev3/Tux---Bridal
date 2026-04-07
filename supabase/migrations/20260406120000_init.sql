-- Tux Bridal — initial schema, RLS, claim_coupon RPC, storage bucket, seed data
-- Requires: PostgreSQL 15+ (Supabase)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.stock_type AS ENUM ('in_stock', 'special_order');

CREATE TYPE public.coupon_status AS ENUM ('pending', 'redeemed', 'expired');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
CREATE TABLE public.suit_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  discount_percent integer NOT NULL CHECK (
    discount_percent >= 0
    AND discount_percent <= 100
  ),
  stock_type public.stock_type NOT NULL,
  image_url text,
  jfw_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'qr_flyer',
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT subscribers_email_normalized CHECK (
    email = lower(trim(email))
    AND length(email) BETWEEN 3 AND 320
  ),
  CONSTRAINT subscribers_email_format CHECK (
    email ~ '^[^@]+@[^@]+\.[^@]+$'
  )
);

CREATE UNIQUE INDEX subscribers_email_unique ON public.subscribers (email);

CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  subscriber_id uuid NOT NULL REFERENCES public.subscribers (id) ON DELETE RESTRICT,
  suit_category_id uuid NOT NULL REFERENCES public.suit_categories (id) ON DELETE RESTRICT,
  discount_percent integer NOT NULL CHECK (
    discount_percent >= 0
    AND discount_percent <= 100
  ),
  stock_type_snapshot text NOT NULL CHECK (
    stock_type_snapshot IN ('in_stock', 'special_order')
  ),
  status public.coupon_status NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT coupons_unique_subscriber_suit UNIQUE (subscriber_id, suit_category_id),
  CONSTRAINT coupons_code_unique UNIQUE (code)
);

CREATE INDEX coupons_subscriber_created_idx ON public.coupons (subscriber_id, created_at DESC);

CREATE INDEX suit_categories_featured_landing_idx ON public.suit_categories (is_featured, is_active)
WHERE
  is_featured = true
  AND is_active = true;

-- Optional: cap featured active suits at 4 (insert/update)
CREATE OR REPLACE FUNCTION public.enforce_max_four_featured_suits () RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  n integer;
BEGIN
  IF NEW.is_featured = true
  AND NEW.is_active = true THEN
    SELECT
      count(*) INTO n
    FROM
      public.suit_categories
    WHERE
      is_featured = true
      AND is_active = true
      AND id IS DISTINCT FROM NEW.id;

    IF n >= 4 THEN
      RAISE EXCEPTION 'FEATURED_SUIT_CAP'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER suit_categories_featured_cap_trg
BEFORE INSERT
OR
UPDATE ON public.suit_categories FOR EACH ROW
EXECUTE PROCEDURE public.enforce_max_four_featured_suits ();

-- ---------------------------------------------------------------------------
-- claim_coupon — dedupe per email+suit, rate limit 3 new coupons / 24h per subscriber
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_coupon (
  p_email text,
  p_suit_category_id uuid,
  p_source text DEFAULT 'qr_flyer'
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO 'public' AS $$
DECLARE
  v_email text;
  v_source text;
  v_subscriber_id uuid;
  v_suit record;
  v_existing record;
  v_count integer;
  v_code text;
  v_coupon record;
  v_attempts integer := 0;
  v_i integer;
  v_byte smallint;
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
BEGIN
  SET LOCAL row_security = off;

  v_email := lower(trim(p_email));

  IF v_email IS NULL
  OR v_email = '' THEN
    RAISE EXCEPTION 'INVALID_EMAIL'
      USING ERRCODE = 'P0001';
  END IF;

  IF length(v_email) > 320
  OR v_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RAISE EXCEPTION 'INVALID_EMAIL'
      USING ERRCODE = 'P0001';
  END IF;

  v_source := coalesce(nullif(trim(p_source), ''), 'qr_flyer');

  INSERT INTO public.subscribers (email, source)
    VALUES (v_email, v_source)
  ON CONFLICT (email)
    DO UPDATE SET
      email = public.subscribers.email
    RETURNING
      id INTO v_subscriber_id;

  SELECT
    * INTO v_suit
  FROM
    public.suit_categories
  WHERE
    id = p_suit_category_id
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SUIT_NOT_FOUND'
      USING ERRCODE = 'P0001';
  END IF;

  SELECT
    c.id,
    c.code,
    c.discount_percent,
    c.stock_type_snapshot,
    c.expires_at,
    c.status,
    c.created_at,
    c.subscriber_id,
    c.suit_category_id INTO v_existing
  FROM
    public.coupons c
  WHERE
    c.subscriber_id = v_subscriber_id
    AND c.suit_category_id = p_suit_category_id;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'reused',
      true,
      'coupon_id',
      v_existing.id,
      'code',
      v_existing.code,
      'discount_percent',
      v_existing.discount_percent,
      'stock_type_snapshot',
      v_existing.stock_type_snapshot,
      'expires_at',
      v_existing.expires_at,
      'status',
      v_existing.status,
      'created_at',
      v_existing.created_at,
      'subscriber_id',
      v_existing.subscriber_id,
      'suit_category_id',
      v_existing.suit_category_id,
      'suit_name',
      v_suit.name,
      'suit_stock_type',
      v_suit.stock_type::text
    );
  END IF;

  SELECT
    count(*) INTO v_count
  FROM
    public.coupons c
  WHERE
    c.subscriber_id = v_subscriber_id
    AND c.created_at > (now() - interval '24 hours');

  IF v_count >= 3 THEN
    RAISE EXCEPTION 'RATE_LIMIT'
      USING ERRCODE = 'P0001';
  END IF;

  <<insert_loop>> LOOP
    v_attempts := v_attempts + 1;

    IF v_attempts > 25 THEN
      RAISE EXCEPTION 'CODE_GEN_FAILED'
        USING ERRCODE = 'P0001';
    END IF;

    v_code := '';

    FOR v_i IN 1..8 LOOP
      v_byte := get_byte(extensions.gen_random_bytes(1), 0);
      v_code := v_code || substr(v_alphabet, (v_byte % 32) + 1, 1);
    END LOOP;

    BEGIN
      INSERT INTO public.coupons (
        code,
        subscriber_id,
        suit_category_id,
        discount_percent,
        stock_type_snapshot,
        status,
        expires_at
      )
        VALUES (
          v_code,
          v_subscriber_id,
          p_suit_category_id,
          v_suit.discount_percent,
          v_suit.stock_type::text,
          'pending',
          now() + interval '30 days'
        )
      RETURNING
        * INTO v_coupon;

      EXIT insert_loop;
    EXCEPTION
      WHEN unique_violation THEN
        -- Code collision; retry
        NULL;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'reused',
    false,
    'coupon_id',
    v_coupon.id,
    'code',
    v_coupon.code,
    'discount_percent',
    v_coupon.discount_percent,
    'stock_type_snapshot',
    v_coupon.stock_type_snapshot,
    'expires_at',
    v_coupon.expires_at,
    'status',
    v_coupon.status,
    'created_at',
    v_coupon.created_at,
    'subscriber_id',
    v_coupon.subscriber_id,
    'suit_category_id',
    v_coupon.suit_category_id,
    'suit_name',
    v_suit.name,
    'suit_stock_type',
    v_suit.stock_type::text
  );
END;
$$;

ALTER FUNCTION public.claim_coupon (text, uuid, text) OWNER TO postgres;

REVOKE ALL ON FUNCTION public.claim_coupon (text, uuid, text)
FROM
  PUBLIC;

GRANT EXECUTE ON FUNCTION public.claim_coupon (text, uuid, text) TO service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.suit_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY suit_categories_select_active_anon ON public.suit_categories FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY suit_categories_select_active_authenticated ON public.suit_categories FOR SELECT TO authenticated
  USING (is_active = true);

-- No direct anon/authenticated DML on subscribers or coupons (writes via RPC + service_role).

-- ---------------------------------------------------------------------------
-- Storage: public images bucket
-- ---------------------------------------------------------------------------
INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('suit-images', 'suit-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS suit_images_public_read ON storage.objects;

CREATE POLICY suit_images_public_read ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'suit-images');

-- ---------------------------------------------------------------------------
-- Seed: suit categories (JFW product URLs — reference only; do not hotlink images)
-- ---------------------------------------------------------------------------
INSERT INTO public.suit_categories (
  name,
  description,
  discount_percent,
  stock_type,
  image_url,
  jfw_url,
  is_featured,
  is_active
)
VALUES
  (
    'Black Legacy Performance Tuxedo',
    'Classic black performance fabric tuxedo — ideal for prom, graduation, and formal events.',
    20,
    'in_stock',
    NULL,
    'https://www.jimsformalwear.com/products/black-legacy-performance-tuxedo-921',
    true,
    true
  ),
  (
    'Navy Performance Stretch Tuxedo',
    'Navy stretch performance tuxedo for a modern, comfortable fit.',
    20,
    'in_stock',
    NULL,
    'https://www.jimsformalwear.com/products/navy-performance-stretch-tuxedo-311',
    true,
    true
  ),
  (
    'Heather Grey Clayton Suit',
    'Heather grey suit — versatile for weddings and quinceañera court.',
    15,
    'in_stock',
    NULL,
    'https://www.jimsformalwear.com/products/heather-grey-clayton-suit-262',
    true,
    true
  ),
  (
    'Black Paisley Aries Tuxedo',
    'Statement black paisley tuxedo for standout formal occasions.',
    20,
    'in_stock',
    NULL,
    'https://www.jimsformalwear.com/products/black-paisley-aries-tuxedo-182',
    true,
    true
  ),
  (
    'Hunter Green Luka Suit',
    'Hunter green suit available by special order through Jim''s Formal Wear.',
    10,
    'special_order',
    NULL,
    'https://www.jimsformalwear.com/products/hunter-green-luka-suit-222',
    false,
    true
  ),
  (
    'Cobalt Blue Tribeca Tuxedo',
    'Cobalt blue tuxedo available by special order — allow lead time.',
    10,
    'special_order',
    NULL,
    'https://www.jimsformalwear.com/products/cobalt-blue-tribeca-tuxedo-211',
    false,
    true
  ),
  (
    'Tan Performance Wedding Suit',
    'Tan performance suit for weddings; ordered via supplier as needed.',
    10,
    'special_order',
    NULL,
    'https://www.jimsformalwear.com/products/tan-performance-wedding-suit-272',
    false,
    true
  );
