-- Rename is_4ps → nhts_status (both are boolean)
ALTER TABLE public.households RENAME COLUMN is_4ps TO nhts_status;
ALTER TABLE public.residents RENAME COLUMN is_4ps TO nhts_status;
