# FHSIS Household Profiling Database Schema & System Architecture

This document defines the highly scalable, normalized database schema required to handle Department of Health (DOH) Field Health Services Information System (FHSIS) household profiling and quarterly updating tracking.

## System Workflow & Core Rules
1. **Quarter Calculation:** Do not store a specific `quarter` field. The backend application or database engine must compute the quarter on the fly using the `visit_date` (e.g., `EXTRACT(QUARTER FROM visit_date)`).
2. **Historical Tracking:** Data changes over time (e.g., environmental adjustments, shifting reproductive status, aging classifications) are handled through transactional tracking logs. This preserves the accuracy of historical reports (e.g., reviewing Q1 data from 2026 without subsequent Q3 updates overriding old records).

---

## 1. Core Master Entities (Static Data)

### households
Stores the permanent identity and location of a physical household unit.
* `id` (UUID, Primary Key): Unique internal system ID.
* `household_code` (VARCHAR, Unique): Official DOH/FHSIS structured identifier.
* `barangay` (VARCHAR): Standard localized cluster indicator. fk to barangay id i guess
* `adress_line1` (VARCHAR, Nullable): Specific physical sector zone.
* `adress_line2` (VARCHAR, Nullable): Specific physical sector zone.
* `created_at` (TIMESTAMP): Date when the structural baseline profile was captured.

### residents
Stores the permanent biological and personal demographics for every individual member of a home.
* `id` (UUID, Primary Key): Unique internal system ID.
* `household_id` (UUID, Foreign Key $\rightarrow$ `households.id`): Connects a resident to their physical home unit.
* `first_name` (VARCHAR): Given identity.
* `last_name` (VARCHAR): Family identity.
* `birth_date` (DATE): Critical field used to automatically evaluate age cohorts (e.g., Newborn, Infant, Under 5, WRA, Senior).
* `sex` (VARCHAR): Restricted values `['M', 'F']` required to stratify target data.

---

## 2. Transactional Visit Logs (Dynamic/Quarterly Data)

### household_environmental_logs
Captures changing structural or environmental statuses during a specific visit date.
* `id` (UUID, Primary Key): Log identifier.
* `household_id` (UUID, Foreign Key $\rightarrow$ `households.id`): Targeted physical home.
* `visit_date` (DATE): **The source of truth for Quarter computation.**
* `water_supply_type` (VARCHAR): Restricted values corresponding to official sanitation metrics `['Level I', 'Level II', 'Level III', 'Unsafe']`.
* `toilet_type` (VARCHAR): Restricted values `['Sanitary', 'Unsanitary', 'None']`.
* `is_4ps_beneficiary` (BOOLEAN): Socioeconomic program classification marker.

### resident_health_logs
Tracks individual quarterly health adjustments. This is the structural baseline needed to cleanly feed into explicit FHSIS Target Client Lists (TCLs).

ignore all not included fields in the form.
* `id` (UUID, Primary Key): Transactional data block identifier.
* `resident_id` (UUID, Foreign Key $\rightarrow$ `residents.id`): Target citizen.
* `visit_date` (DATE): **The source of truth for individual status during a specific Quarter.**
* `is_pregnant` (BOOLEAN): Drives Maternal Health indicators.
* `is_lactating` (BOOLEAN): Drives Post-Partum health tracking metrics.
* `nutrition_status` (VARCHAR, Nullable): Dynamic status e.g., `['Normal', 'Underweight', 'Severely Underweight', 'Overweight']`.
* `is_hypertensive` (BOOLEAN): Chronic tracking data point.
* `is_diabetic` (BOOLEAN): Chronic tracking data point.

---

## 3. Database Indexes for Performance Scaling
To maintain structural sub-second query performance as the application grows across multi-year data scopes, populate your database engine execution patterns with the following composite lookup optimization fields:

```sql
CREATE INDEX idx_hh_env_visit ON household_environmental_logs (household_id, visit_date);
CREATE INDEX idx_res_health_visit ON resident_health_logs (resident_id, visit_date);