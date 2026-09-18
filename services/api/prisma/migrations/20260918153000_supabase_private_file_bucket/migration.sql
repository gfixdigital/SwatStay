-- Keep one private bucket for payment proofs and future protected media/documents.
-- Supabase Storage owns the storage.objects rows; the application stores only paths.
-- This migration is a no-op when the Supabase storage schema does not exist
-- (e.g. when running against a plain PostgreSQL database with local file storage).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'swatstay-files',
      'swatstay-files',
      false,
      5242880,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
    )
    ON CONFLICT (id) DO UPDATE SET
      public = false,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  END IF;
END $$;