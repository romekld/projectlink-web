-- Drop redundant columns
-- relationship_other/religion_other: merged into relationship/religion (store free-text directly)

ALTER TABLE public.residents
  DROP COLUMN relationship_other,
  DROP COLUMN religion_other;
