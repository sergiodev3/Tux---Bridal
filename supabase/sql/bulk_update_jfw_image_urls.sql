-- Bulk update JFW image URLs for the current featured catalog.
-- Uses Firebase image-cache URLs provided by the business owner.

BEGIN;

UPDATE public.suit_categories
SET jfw_image_url = CASE name
  WHEN 'Black Legacy Performance Tuxedo' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-tuxedo-black-performance-michael-kors-legacy-921-1.jpg?alt=media'
  WHEN 'Navy Performance Stretch Tuxedo' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-suit-nay-performance-stretch-michael-kors-311.jpg?alt=media'
  WHEN 'Heather Grey Clayton Suit' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-suit-heather-grey-allure-men-clayton-262-1.jpg?alt=media'
  WHEN 'Black Paisley Aries Tuxedo' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fprom-tuxedo-black-paisley-mark-of-distinction-aries-182-23-1.jpg?alt=media'
  WHEN 'Hunter Green Luka Suit' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fike-behar-hunter-green-luka-slim-fit-suit.jpg?alt=media'
  WHEN 'Cobalt Blue Tribeca Tuxedo' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-tuxedo-blue-ike-behar-tribeca-211-1.jpg?alt=media'
  WHEN 'Tan Performance Wedding Suit' THEN 'https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-suit-tan-performance-stretch-michael-kors-272.jpg?alt=media'
  ELSE jfw_image_url
END
WHERE name IN (
  'Black Legacy Performance Tuxedo',
  'Navy Performance Stretch Tuxedo',
  'Heather Grey Clayton Suit',
  'Black Paisley Aries Tuxedo',
  'Hunter Green Luka Suit',
  'Cobalt Blue Tribeca Tuxedo',
  'Tan Performance Wedding Suit'
);

COMMIT;

-- Optional verification:
-- SELECT name, image_url, jfw_image_url, jfw_url
-- FROM public.suit_categories
-- ORDER BY name;
