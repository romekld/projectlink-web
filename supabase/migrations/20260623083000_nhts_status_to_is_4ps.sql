-- Replace nhts_status text columns with is_4ps boolean
-- The form uses a boolean switch, so store it as boolean.

ALTER TABLE public.households
  DROP COLUMN nhts_status,
  ADD COLUMN is_4ps boolean NOT NULL DEFAULT false;

ALTER TABLE public.residents
  DROP COLUMN nhts_status,
  ADD COLUMN is_4ps boolean NOT NULL DEFAULT false;
