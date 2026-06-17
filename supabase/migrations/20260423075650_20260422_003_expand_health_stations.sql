ALTER TABLE public.health_stations
  ADD COLUMN IF NOT EXISTS station_code             text,
  ADD COLUMN IF NOT EXISTS physical_city_barangay_id uuid REFERENCES public.city_barangays(id),
  ADD COLUMN IF NOT EXISTS address                  text,
  ADD COLUMN IF NOT EXISTS notes                    text,
  ADD COLUMN IF NOT EXISTS deactivated_at           timestamptz,
  ADD COLUMN IF NOT EXISTS deactivation_reason      text,
  ADD COLUMN IF NOT EXISTS latitude                 numeric(10, 7),
  ADD COLUMN IF NOT EXISTS longitude                numeric(10, 7),
  ADD COLUMN IF NOT EXISTS updated_at               timestamptz,
  ADD COLUMN IF NOT EXISTS created_by               uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS updated_by               uuid REFERENCES public.profiles(id);

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM public.health_stations
)
UPDATE public.health_stations
SET station_code = 'BHS-2026-' || LPAD(numbered.rn::text, 3, '0')
FROM numbered
WHERE public.health_stations.id = numbered.id
  AND public.health_stations.station_code IS NULL;

ALTER TABLE public.health_stations
  ADD CONSTRAINT health_stations_station_code_key UNIQUE (station_code);

UPDATE public.health_stations SET facility_type = 'bhs' WHERE facility_type = 'BHS';

ALTER TABLE public.health_stations
  DROP CONSTRAINT IF EXISTS health_stations_facility_type_check;

ALTER TABLE public.health_stations
  ADD CONSTRAINT health_stations_facility_type_check
  CHECK (facility_type IN ('bhs', 'main_bhs', 'satellite'));

ALTER TABLE public.health_stations
  ALTER COLUMN facility_type SET DEFAULT 'bhs';

UPDATE public.health_stations
SET slug = LOWER(REGEXP_REPLACE(station_code, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

DROP TRIGGER IF EXISTS set_health_stations_updated_at ON public.health_stations;
CREATE TRIGGER set_health_stations_updated_at
  BEFORE UPDATE ON public.health_stations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS health_stations_physical_city_barangay_idx
  ON public.health_stations(physical_city_barangay_id);

CREATE INDEX IF NOT EXISTS health_stations_is_active_idx
  ON public.health_stations(is_active);

CREATE TABLE IF NOT EXISTS public.health_station_coverage (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  health_station_id uuid        NOT NULL REFERENCES public.health_stations(id) ON DELETE CASCADE,
  barangay_id       uuid        NOT NULL REFERENCES public.barangays(id) ON DELETE CASCADE,
  is_primary        boolean     NOT NULL DEFAULT false,
  is_active         boolean     NOT NULL DEFAULT true,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz,
  created_by        uuid        REFERENCES public.profiles(id),
  updated_by        uuid        REFERENCES public.profiles(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS health_station_coverage_active_pair_idx
  ON public.health_station_coverage(health_station_id, barangay_id)
  WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS health_station_coverage_active_primary_idx
  ON public.health_station_coverage(barangay_id)
  WHERE is_primary = true AND is_active = true;

CREATE INDEX IF NOT EXISTS health_station_coverage_station_idx
  ON public.health_station_coverage(health_station_id, is_active);

CREATE INDEX IF NOT EXISTS health_station_coverage_barangay_idx
  ON public.health_station_coverage(barangay_id, is_active);

DROP TRIGGER IF EXISTS set_health_station_coverage_updated_at ON public.health_station_coverage;
CREATE TRIGGER set_health_station_coverage_updated_at
  BEFORE UPDATE ON public.health_station_coverage
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.health_station_coverage ENABLE ROW LEVEL SECURITY;
;
