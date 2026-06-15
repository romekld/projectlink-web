# Database Design Specification: Household Profiling

This document outlines the database schema and architecture for the Household Profiling feature in Project LINK, based on the [PROFILING_CONTEXT.md](./PROFILING_CONTEXT.md) and DOH FHSIS requirements.

## 1. Architectural Strategy: "Consolidated Core, Virtual Lists"
To ensure data integrity and avoid synchronization errors, the design follows a **Normalized Single Source of Truth** pattern.

- **Unified Storage**: All household data lives in exactly two tables.
- **Virtual Master Lists**: Program-specific master lists (e.g., Senior Citizens, WRA, 4Ps) are implemented as **Postgres Views**, not separate tables.
- **Local-First Ready**: The schema is designed to map directly to the `LocalHousehold` and `LocalHouseholdMember` types used in the BHW mobile application.

---

## 2. Table Definitions

### 2.1 Table: `households`
Captures environmental and metadata information at the dwelling level.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default: `gen_random_uuid()` | Unique internal ID. |
| `household_number` | `text` | Unique, Required | Format: `YYYYMM-FacilityCode-No`. |
| `visit_date` | `date` | Required | Date profiling was conducted. |
| `barangay_id` | `uuid` | FK -> `city_barangays` | The physical location. |
| `enumeration_area` | `text` | Optional | EA/Segment identifier. |
| `family_count` | `integer` | Default: 1 | Number of families in HH. |
| **Environmental** | | | |
| `water_source` | `water_source_level` | Required (Enum) | Level I, II, or III. |
| `toilet_facility` | `toilet_type` | Required (Enum) | Sanitary vs Unsanitary types. |
| **Audit** | | | |
| `assigned_bhw_id` | `uuid` | FK -> `profiles` | The BHW who conducted profiling. |
| `reviewed_by_id` | `uuid` | FK -> `profiles` | The supervising Midwife. |
| `sync_status` | `hh_sync_status` | Default: `pending_validation` | Validation workflow state. |

### 2.2 Table: `household_members`
Captures individual demographic and health data.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default: `gen_random_uuid()` | Unique internal ID. |
| `household_id` | `uuid` | FK -> `households` (Cascade) | Parent household. |
| `last_name` | `text` | Required | |
| `first_name` | `text` | Required | |
| `middle_name` | `text` | Optional | Mother's Maiden Name (DOH standard). |
| `birthdate` | `date` | Required | Used for dynamic age calculation. |
| `sex` | `text` | 'M' or 'F' | |
| `relationship` | `rel_to_head` | Required (Enum) | Head, Spouse, etc. |
| `civil_status` | `civil_status` | Required (Enum) | Single, Married, etc. |
| **Social/Insurance** | | | |
| `nhts_status` | `nhts_status` | Required (Enum) | 4Ps vs Non-4Ps. |
| `four_ps_id` | `text` | Optional | Required if `nhts_status` is 4Ps. |
| `philhealth_id` | `text` | Optional | |
| `ph_category` | `ph_category` | Required (Enum) | Direct, Indirect, Unknown. |
| **Health/FP** | | | |
| `medical_history` | `jsonb` | Default: `[]` | List of allergies, illnesses, surgeries. |
| `is_pregnant` | `boolean` | Default: `false` | |
| `lmp` | `date` | Optional | Required if `is_pregnant` is true. |
| `fp_method` | `text` | Optional | Family Planning method used. |
| **Optional/Extension** | | | |
| `education` | `text` | Optional | Highest educational attainment. |
| `religion` | `text` | Optional | |
| `metadata` | `jsonb` | Default: `{}` | For future-proofing and role-specific fields. |

---

## 3. Lookup Types (Enums)

To ensure data consistency, the following custom Postgres types are used:

- `water_source_level`: `Level I`, `Level II`, `Level III`
- `toilet_type`: `Sanitary-VIP`, `Sanitary-Septic`, `Unsanitary-Open`, `None`
- `civil_status`: `Single`, `Married`, `Widowed`, `Separated`, `Cohabitation`
- `rel_to_head`: `Head`, `Spouse`, `Son`, `Daughter`, `Other`
- `classification_code`: `Infant`, `Child`, `Adolescent`, `WRA`, `Pregnant`, `Senior`, etc.

---

## 4. Master List Implementation (Views)

Master lists are created using SQL views to provide program-specific data without redundancy.

### Example: Senior Citizen Master List
```sql
CREATE VIEW master_list_seniors AS
SELECT 
  m.*,
  date_part('year', age(m.birthdate)) as current_age,
  h.household_number,
  h.barangay_id
FROM household_members m
JOIN households h ON m.household_id = h.id
WHERE date_part('year', age(m.birthdate)) >= 60;
```

---

## 5. Security & RLS Policies

- **BHW Role**:
    - `SELECT`: Only households where `assigned_bhw_id = auth.uid()`.
    - `INSERT/UPDATE`: Allowed for assigned households until `sync_status` is `validated`.
- **Midwife (RHM) Role**:
    - `SELECT`: All households within their Health Station coverage.
    - `UPDATE`: Only for validation and `reviewed_by_id` signing.
- **PHN/PHIS Role**:
    - `SELECT`: Read-only access to all master list views for reporting.

---

## 6. Optimization Notes (Supabase)

1. **Foreign Key Indexes**: Always index `household_id` in `household_members` to speed up joins.
2. **Partial Indexes**: Create an index on `nhts_status` where it equals `NHTS-4Ps` to optimize social welfare reporting.
3. **Computed Columns**: For UI performance, a generated column or view for `age` is preferred over calculating it on the client side.
