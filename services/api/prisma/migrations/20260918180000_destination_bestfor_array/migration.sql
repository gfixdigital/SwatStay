-- Destination.bestFor is declared as String[] in the schema but was initially
-- created as TEXT. Reconcile the column so scalar-list mapping works.
ALTER TABLE "Destination"
  ALTER COLUMN "bestFor" TYPE TEXT[] USING ARRAY["bestFor"];