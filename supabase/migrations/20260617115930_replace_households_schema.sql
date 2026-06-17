-- Drop existing household-related objects (Phase 1: Wipe & Reset)
DROP TABLE IF EXISTS public.household_members CASCADE;
DROP TABLE IF EXISTS public.households CASCADE;
DROP TYPE IF EXISTS public.nhts_status CASCADE;
DROP TYPE IF EXISTS public.hh_sync_status CASCADE;
DROP TYPE IF EXISTS public.relationship_to_hh_head CASCADE;
DROP TYPE IF EXISTS public.classification_code CASCADE;
DROP TYPE IF EXISTS public.philhealth_category CASCADE;

-- Create New Enums (Descriptive)
CREATE TYPE public.water_source_level AS ENUM ('Level I', 'Level II', 'Level III');
CREATE TYPE public.toilet_type AS ENUM ('Sanitary-VIP', 'Sanitary-Septic', 'Unsanitary-Open', 'None');
CREATE TYPE public.civil_status AS ENUM ('Single', 'Married', 'Widowed', 'Separated', 'Cohabitation');
CREATE TYPE public.rel_to_head AS ENUM ('Head', 'Spouse', 'Son', 'Daughter', 'Other');
CREATE TYPE public.classification_code AS ENUM (
  'Infant', 'Child', 'Adolescent', 'WRA', 'Pregnant', 'Post-Partum', 'Senior Citizen', 'PWD', 'Adult'
);
CREATE TYPE public.nhts_status AS ENUM ('4Ps', 'Non-4Ps');
CREATE TYPE public.ph_category AS ENUM ('Direct', 'Indirect', 'Unknown');
CREATE TYPE public.hh_sync_status AS ENUM (
  'draft', 'pending_sync', 'pending_validation', 'returned', 'validated'
);

-- households table
CREATE TABLE public.households (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_number            text UNIQUE,
  visit_date                  date NOT NULL,
  quarter                     smallint NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  barangay_id                 uuid REFERENCES public.city_barangays(id),
  house_no_street             text,
  purok                       text,
  enumeration_area            text,
  family_count                integer NOT NULL DEFAULT 1,
  respondent_last_name        text NOT NULL,
  respondent_first_name       text NOT NULL,
  respondent_middle_name      text,
  water_source                public.water_source_level NOT NULL,
  toilet_facility             public.toilet_type NOT NULL,
  assigned_bhw_id             uuid REFERENCES public.profiles(id),
  reviewed_by_id              uuid REFERENCES public.profiles(id),
  sync_status                 public.hh_sync_status NOT NULL DEFAULT 'pending_validation',
  year                        smallint NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- household_members table
CREATE TABLE public.household_members (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id                uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  last_name                   text NOT NULL,
  first_name                  text NOT NULL,
  middle_name                 text, -- Mother's Maiden Name (DOH standard)
  birthdate                   date NOT NULL,
  sex                         text CHECK (sex IN ('M', 'F')) NOT NULL,
  relationship                public.rel_to_head NOT NULL,
  civil_status                public.civil_status NOT NULL,
  nhts_status                 public.nhts_status NOT NULL,
  four_ps_id                  text,
  philhealth_id               text,
  ph_category                 public.ph_category NOT NULL,
  medical_history             jsonb NOT NULL DEFAULT '[]',
  classification              public.classification_code NOT NULL,
  is_pregnant                 boolean NOT NULL DEFAULT false,
  lmp                         date,
  using_fp                    boolean NOT NULL DEFAULT false,
  fp_method                   text,
  education                   text,
  religion                    text,
  metadata                    jsonb NOT NULL DEFAULT '{}',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_household_members_household_id ON public.household_members(household_id);
CREATE INDEX idx_households_assigned_bhw_id ON public.households(assigned_bhw_id);
CREATE INDEX idx_households_barangay_id ON public.households(barangay_id);

-- Household Number Generation
CREATE SEQUENCE IF NOT EXISTS public.household_number_seq;

CREATE OR REPLACE FUNCTION public.generate_household_number()
RETURNS TRIGGER AS $$
DECLARE
  v_station_code text;
  v_seq int;
BEGIN
  -- Fetch the station code of the assigned BHW
  SELECT hs.station_code INTO v_station_code
    FROM public.health_stations hs
    JOIN public.profiles p ON p.health_station_id = hs.id
    WHERE p.id = NEW.assigned_bhw_id;

  IF v_station_code IS NULL THEN
    v_station_code := 'UNK';
  END IF;

  v_seq := nextval('public.household_number_seq');
  
  -- Format: YYYYMM-FacilityCode-No(00000)
  NEW.household_number := TO_CHAR(NEW.visit_date, 'YYYYMM') || '-' || v_station_code || '-' || LPAD(v_seq::text, 5, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_household_number
  BEFORE INSERT ON public.households
  FOR EACH ROW
  WHEN (NEW.household_number IS NULL)
  EXECUTE FUNCTION public.generate_household_number();

-- RLS
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;

-- BHW Policies
CREATE POLICY "bhw_manage_households" ON public.households
  FOR ALL USING (assigned_bhw_id = auth.uid());

CREATE POLICY "bhw_manage_members" ON public.household_members
  FOR ALL USING (
    household_id IN (
      SELECT id FROM public.households WHERE assigned_bhw_id = auth.uid()
    )
  );

-- Staff Policies (RHM, PHN, etc.)
CREATE POLICY "staff_view_households" ON public.households
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.health_station_id = households.barangay_id -- Simplified for this example, usually station-barangay mapping
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('phn', 'phis', 'cho', 'system_admin')
    )
  );

CREATE POLICY "staff_view_members" ON public.household_members
  FOR SELECT USING (
    household_id IN (
      SELECT id FROM public.households
    ) -- Logic would mirror households policy
  );

-- Update triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_households_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_household_members_updated_at
  BEFORE UPDATE ON public.household_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
