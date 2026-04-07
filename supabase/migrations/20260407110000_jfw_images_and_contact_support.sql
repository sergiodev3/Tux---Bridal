-- Add support for JFW-hosted images while keeping self-hosted images as preferred option.
-- This migration is safe to run multiple times.

ALTER TABLE public.suit_categories
ADD COLUMN IF NOT EXISTS jfw_image_url text;

COMMENT ON COLUMN public.suit_categories.jfw_image_url IS
'Optional image URL hosted by jimsformalwear.com. Used as fallback when image_url is null.';

-- Optional data checks (allow null, but if present must be http/https).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'suit_categories_jfw_image_url_http_check'
  ) THEN
    ALTER TABLE public.suit_categories
    ADD CONSTRAINT suit_categories_jfw_image_url_http_check
    CHECK (
      jfw_image_url IS NULL
      OR jfw_image_url ~* '^https?://'
    );
  END IF;
END
$$;

-- Optional helper index for dashboard filtering.
CREATE INDEX IF NOT EXISTS suit_categories_jfw_image_url_idx
  ON public.suit_categories (jfw_image_url)
  WHERE jfw_image_url IS NOT NULL;

-- IMPORTANT:
-- For each suit, copy the direct JFW image URL into jfw_image_url.
-- Example:
-- UPDATE public.suit_categories
-- SET jfw_image_url = 'https://www.jimsformalwear.com/<direct-image-path>.jpg'
-- WHERE name = 'Black Legacy Performance Tuxedo';
