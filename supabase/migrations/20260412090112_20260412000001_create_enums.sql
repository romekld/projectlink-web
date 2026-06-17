-- User roles
CREATE TYPE public.user_role AS ENUM (
  'bhw',
  'rhm',
  'phn',
  'phis',
  'cho',
  'system_admin'
);

-- User account statuses
CREATE TYPE public.user_status AS ENUM (
  'active',
  'inactive',
  'invited',
  'suspended'
);;
