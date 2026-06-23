-- v2 Households Schema
-- Complete redesign aligned with Household Creation Wizard form fields.
-- Replaces all previous household-related tables, types, and objects.

-- ============================================================
-- Phase 1: Drop existing household objects (clean slate)
-- ============================================================
DROP TRIGGER IF EXISTS tr_generate_household_number ON public.households;
DROP FUNCTION IF EXISTS public.generate_household_number;
DROP SEQUENCE IF EXISTS public.household_number_seq;

DROP TABLE IF EXISTS public.household_members CASCADE;
DROP TABLE IF EXISTS public.residents CASCADE;
DROP TABLE IF EXISTS public.households CASCADE;

DROP TYPE IF EXISTS public.hh_sync_status CASCADE;

-- ============================================================
-- Phase 2: Enums (internal workflow only — form values validated by app)
-- ============================================================

-- Validation / sync workflow (not a form field — used by RLS policies)
CREATE TYPE public.hh_sync_status AS ENUM (
  'draft', 'pending_sync', 'pending_validation', 'returned', 'validated'
);

-- ============================================================
-- Phase 3: households table
-- ============================================================
CREATE TABLE public.households (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_number        text        UNIQUE,
  visit_date              date        NOT NULL,
  barangay_id             uuid        NOT NULL REFERENCES public.city_barangays(id),
  house_no_street         text,
  purok                   text,
  enumeration_area        text,
  family_count            integer     NOT NULL DEFAULT 1 CHECK (family_count >= 1),
  respondent_last_name    text        NOT NULL,
  respondent_first_name   text        NOT NULL,
  respondent_middle_name  text,
  water_source            text NOT NULL,
  toilet_facility         text NOT NULL,
  nhts_status             text NOT NULL DEFAULT 'Non-4Ps',
  is_indigenous           boolean     NOT NULL DEFAULT false,

  -- Pin location (Step 2)
  latitude                numeric(10, 7),
  longitude               numeric(10, 7),
  location                geography(Point, 4326),

  -- Assignment & workflow
  assigned_bhw_id         uuid        NOT NULL REFERENCES public.profiles(id),
  reviewed_by_id          uuid        REFERENCES public.profiles(id),
  sync_status             public.hh_sync_status NOT NULL DEFAULT 'pending_validation',
  year                    smallint    NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),

  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.households IS 'Permanent identity and current snapshot of a physical household unit.';
COMMENT ON COLUMN public.households.latitude IS 'WGS84 latitude from Step 2 pin placement.';
COMMENT ON COLUMN public.households.longitude IS 'WGS84 longitude from Step 2 pin placement.';
COMMENT ON COLUMN public.households.location IS 'PostGIS geography point derived from lat/lng for spatial queries.';

-- ============================================================
-- Phase 4: residents table
-- ============================================================
CREATE TABLE public.residents (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id                uuid        NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  last_name                   text        NOT NULL,
  first_name                  text        NOT NULL,
  middle_name                 text,
  birthdate                   date        NOT NULL,
  sex                         char(1)     CHECK (sex IN ('M', 'F')) NOT NULL,
  relationship                text NOT NULL,
  relationship_other          text,
  civil_status                text NOT NULL,
  education                   text,
  religion                    text,
  religion_other              text,

  -- Social / insurance
  nhts_status                 text NOT NULL DEFAULT 'Non-4Ps',
  four_ps_id                  text,
  is_indigenous               boolean     NOT NULL DEFAULT false,
  is_philhealth_member        boolean     NOT NULL DEFAULT false,
  philhealth_id               text,
  philhealth_membership_type  char(1)     CHECK (philhealth_membership_type IN ('M', 'D')),
  philhealth_category         text,

  -- Health snapshot (current state at last visit)
  medical_history             jsonb       NOT NULL DEFAULT '[]',
  classification              text NOT NULL,
  is_pregnant                 boolean     NOT NULL DEFAULT false,
  lmp                         date,

  -- Family Planning
  using_fp                    boolean     NOT NULL DEFAULT false,
  fp_methods                  jsonb       NOT NULL DEFAULT '[]',
  fp_status                   text        CHECK (fp_status IN ('NA', 'CU', 'CM', 'CC', 'DO', 'R')),

  -- Extensibility
  metadata                    jsonb       NOT NULL DEFAULT '{}',

  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.residents IS 'Individual member data — current state snapshot from last profiling visit.';
COMMENT ON COLUMN public.residents.classification IS 'Classification at time of last visit (snapshot). Current classification is derivable from birthdate + sex + is_pregnant.';
COMMENT ON COLUMN public.residents.fp_methods IS 'Array of family planning method identifiers (e.g. ["COC", "IUD"]).';
COMMENT ON COLUMN public.residents.fp_status IS 'Family Planning status: NA=New Acceptor, CU=Current User, CM=Changing Method, CC=Changing Clinic, DO=Dropout, R=Restarter.';

-- ============================================================
-- Phase 5: Indexes
-- ============================================================
CREATE INDEX idx_residents_household      ON public.residents(household_id);
CREATE INDEX idx_households_assigned_bhw  ON public.households(assigned_bhw_id);
CREATE INDEX idx_households_barangay      ON public.households(barangay_id);
CREATE INDEX idx_households_bhw_visit     ON public.households(assigned_bhw_id, visit_date DESC);
CREATE INDEX idx_households_location      ON public.households USING GIST(location);
CREATE INDEX idx_households_pending_sync  ON public.households(sync_status) WHERE sync_status = 'pending_validation';

-- ============================================================
-- Phase 6: Household Number Auto-Generation
-- Format: YYYYMM-FacilityCode-NO(00000)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.household_number_seq;

CREATE OR REPLACE FUNCTION public.generate_household_number()
RETURNS TRIGGER AS $$
DECLARE
  v_station_code text;
  v_seq int;
BEGIN
  SELECT hs.station_code INTO v_station_code
    FROM public.health_stations hs
    JOIN public.profiles p ON p.health_station_id = hs.id
    WHERE p.id = NEW.assigned_bhw_id;

  IF v_station_code IS NULL THEN
    v_station_code := 'UNK';
  END IF;

  v_seq := nextval('public.household_number_seq');

  NEW.household_number := TO_CHAR(NEW.visit_date, 'YYYYMM')
    || '-' || v_station_code
    || '-' || LPAD(v_seq::text, 5, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_household_number
  BEFORE INSERT ON public.households
  FOR EACH ROW
  WHEN (NEW.household_number IS NULL)
  EXECUTE FUNCTION public.generate_household_number();

-- ============================================================
-- Phase 7: Location sync trigger
-- Auto-populates the PostGIS geography point from lat/lng columns.
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_household_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_household_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.sync_household_location();

-- ============================================================
-- Phase 8: Update timestamp triggers
-- ============================================================
CREATE TRIGGER tr_households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_residents_updated_at
  BEFORE UPDATE ON public.residents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Phase 9: Row-Level Security
-- ============================================================
ALTER TABLE public.households            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents     ENABLE ROW LEVEL SECURITY;

-- BHW: full CRUD on own assigned households
CREATE POLICY "bhw_manage_households" ON public.households
  FOR ALL
  USING (assigned_bhw_id = auth.uid());

CREATE POLICY "bhw_manage_residents" ON public.residents
  FOR ALL
  USING (
    household_id IN (
      SELECT id FROM public.households WHERE assigned_bhw_id = auth.uid()
    )
  );

-- Staff (RHM, PHN, PHIS, CHO, System Admin): read access
CREATE POLICY "staff_view_households" ON public.households
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('rhm', 'phn', 'phis', 'cho', 'system_admin')
    )
  );

CREATE POLICY "staff_view_residents" ON public.residents
  FOR SELECT
  USING (
    household_id IN (SELECT id FROM public.households)
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('rhm', 'phn', 'phis', 'cho', 'system_admin')
    )
  );
