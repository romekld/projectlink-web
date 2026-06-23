# Schema Alignment: New Household Wizard

Documents how the new wizard's store types map to the database schema, and
which mismatches remain for the service layer.

## HouseholdFormData → households table

| Store field              | DB column              | Status     | Notes                               |
|--------------------------|------------------------|------------|-------------------------------------|
| `barangay`               | `barangay_id` (uuid)   | ⚡ service  | Form stores name, needs UUID lookup |
| `addressLine1`           | `house_no_street`      | ✅         |                                     |
| `addressLine2`           | `purok`                | ✅         |                                     |
| `respondentLastName`     | `respondent_last_name` | ✅         |                                     |
| `respondentFirstName`    | `respondent_first_name`| ✅         |                                     |
| `respondentMiddleName`   | `respondent_middle_name`| ✅        |                                     |
| `waterSource`            | `water_source`         | ✅         |                                     |
| `toiletFacility`         | `toilet_facility`      | ✅         |                                     |
| `visitDate`              | `visit_date`           | ✅         |                                     |
| `familyCount`            | `family_count`         | ✅         |                                     |
| `is4ps`                  | `is_4ps`               | ✅         | Refactored from `nhts_status`       |
| `is4psId`                | —                      | ⚠️ unused  | Only stored per-member (`residents.four_ps_id`) |
| `isIndigenous`           | `is_indigenous`        | ✅         |                                     |

### DB columns not in store

| Column              | Reason                              |
|---------------------|--------------------------------------|
| `enumeration_area`  | Not captured by form yet             |
| `latitude`/`longitude` | Store via `pinLocation` (Step 2)  |
| `location`          | Auto-populated by DB trigger         |
| `assigned_bhw_id`   | Set server-side from auth            |
| `reviewed_by_id`    | Set during review workflow           |
| `sync_status`       | Set by create-household action       |
| `year`              | Defaults to `EXTRACT(YEAR FROM ...)` |

## HouseholdMember → residents table

| Store field               | DB column                  | Status     | Notes                                  |
|---------------------------|----------------------------|------------|----------------------------------------|
| `id`                      | `id` (uuid)                | ✅         |                                        |
| `lastName`                | `last_name`                | ✅         |                                        |
| `firstName`               | `first_name`               | ✅         |                                        |
| `middleName`              | `middle_name`              | ✅         |                                        |
| `sex` (`male`/`female`)   | `sex` (`M`/`F`)            | ⚡ service  | Needs transform at service layer       |
| `dateOfBirth`             | `birthdate`                | ✅         |                                        |
| `age`                     | —                          | ⚡ strip    | Computed from DOB, do not send to DB   |
| `ageGroup`                | `classification`           | ⚠️ naming  | Same value, different name             |
| `relationship`            | `relationship`             | ✅         |                                        |
| `relationshipOther`       | `relationship_other`       | ✅         |                                        |
| `civilStatus`             | `civil_status`             | ✅         |                                        |
| `education`               | `education`                | ✅         |                                        |
| `religion`                | `religion`                 | ✅         |                                        |
| `religionOther`           | `religion_other`           | ✅         |                                        |
| `is4ps`                   | `is_4ps`                   | ✅         |                                        |
| `is4psId`                 | `four_ps_id`               | ✅         |                                        |
| `isIndigenous`            | `is_indigenous`            | ✅         |                                        |
| `isPhilhealthMember`      | `is_philhealth_member`     | ✅         |                                        |
| `philhealthId`            | `philhealth_id`            | ✅         |                                        |
| `philhealthMembershipType`| `philhealth_membership_type`| ⚡ service | DB CHECK `M`/`D`, validate before send |
| `philhealthCategory`      | `philhealth_category`      | ✅         |                                        |
| `medicalHistory`          | `medical_history` (jsonb)  | ✅         | String array → JSON                    |
| `lmpDate`                 | `lmp`                      | ✅         |                                        |
| `isPregnant`              | `is_pregnant`              | ✅         | Derived from `classification`          |
| `usingFP`                 | `using_fp`                 | ✅         |                                        |
| `fpMethods`               | `fp_methods` (jsonb)       | ✅         | String array → JSON                    |
| `fpStatus`                | `fp_status`                | ⚡ service | DB CHECK `NA`,`CU`,`CM`,`CC`,`DO`,`R` |

## nhtsStatus → is4ps Refactor

`nhts_status` was removed from both tables and replaced with `is_4ps boolean NOT NULL DEFAULT false`.
All form code, store types, server action, offline types, and sync mapping were updated in tandem.

## Service Layer Responsibilities (not yet implemented)

The submit action (`new/actions/`) will need to:

1. Resolve `barangay` name → `barangay_id` UUID
2. Strip `age` from member data (computed from `dateOfBirth`)
3. Map `sex` values (`"male"` ↔ `"M"`, `"female"` ↔ `"F"`)
4. Validate `philhealthMembershipType` is only `"M"` or `"D"`
5. Validate `fpStatus` against allowed values
6. Stringify `medicalHistory` and `fpMethods` arrays to JSON
7. Derive `isPregnant` from classification (currently done in form submit handler)

## Deprecated Wizards

`hh-wizard/` and `hh-profile-wizard/` are intentionally broken by the schema migration.
They reference dropped tables (`household_members`) and removed columns.
