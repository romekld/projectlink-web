
# Project LINK (Local Information Network for Kalusugan)

### AI Agent System Context & Development Guidelines

Project LINK is an integrated health station management system for the **City Health Office II (CHO II), Dasmariñas City**. It digitizes paper-based health records across **32 Barangay Health Stations (BHS)** and consolidates them into a centralized city-wide analytics and reporting platform—replacing a fully manual, error-prone system that serves **164,691 people**.

This document serves as the absolute system context, architectural map, and source of truth for the AI implementation agent. Adhere to the database schema design, workflow constraints, and business logic defined below.

---

## 1. System Architecture & Core Design Principles

When writing code, creating API endpoints, or generating database migrations, enforce these three architectural mandates:

1. **Single Source of Truth (No Redundant Tables):** The Individual Treatment Record (`eitr_visits`) captures all dynamic clinical data. Target Client Lists (TCLs) and FHSIS reports must be computed dynamically or handled via background async triggers.
2. **Unified Entity Normalization:** Human beings residing in the barangay must exist in **exactly one** table: `residents`. The concepts of "Household Members", "Resident Master List", and "Patient Profiles" are simply different frontend filters/queries of this single table.
3. **Operational Escape Hatches:** Frontends must support non-linear workflows (e.g., overriding queue order for emergencies, saving incomplete local drafts during internet dropouts, and checking in unprofiled patients via quick-registration).

---

## 2. User Matrix & Access Control (RLS)

All database queries must enforce Row-Level Security (RLS) based on the user's logged-in role and geographic boundary mapping.

| Role | Code | Primary Surface | Core Responsibility | Scope of Data Access |
| --- | --- | --- | --- | --- |
| **System Admin** | `system_admin` | Internal Dashboard | Platform administration and configuration | Full global read/write access across the cluster. |
| **City Health Officer** | `cho` | Internal Dashboard | Oversight, final data-quality review, reporting export/submission, and city-level monitoring | Read access to city-wide aggregated analytics. Write access limited to the *Emerging Disease Validation Gate*. Cannot read raw patient charts unless explicitly audited. |
| **Rural Health Midwife** | `rhm` | Internal Dashboard / Mobile Web | BHS clinical workflows and record stewardship | Full read/write clinical access to all residents and e-ITRs within their **assigned BHS catchment area**. |
| **Barangay Health Worker** | `bhw` | Mobile-first Web App | Field capture, profiling, triage, and follow-up workflows | Read/Write access to demographics and triage logs within their **assigned Barangay/Purok**. **Strictly barred** from reading past clinical diagnoses or midwife-encoded e-ITR notes. |


## 4. Operational Workflow Frameworks

When implementing UI paths or backend functions, follow these phased execution instructions:

### Phase A: Direct Patient Search & Quick-Register (BHW Interface)

* The search form must look up fields directly from the global `residents` table.
* **The UI Component:** Render results as a high-density, mobile-tailored **Card List** using Tailwind CSS (avoid massive HTML tables on mobile layouts). Ensure large, thumb-friendly touch targets showing: `LAST NAME, FIRST NAME`, `DOB (Age)`, `Sex`, and `Purok`.
* **The Escape Hatch Logic:** If a lookup fails, provide a prominent "Quick Register" option. On click, create a row in `residents` with `is_temporary = true` and `household_id = NULL`. This allows immediate queuing.
* **Data Reconciliation Loop:** Implement a background dashboard view for BHWs to track `is_temporary = true` rows during downtime, forcing them to capture household profiling details and hook the patient back to a standard `household_id` post-consultation.

### Phase B: Non-Linear Queue Handling (Midwife Dashboard)

* Upon saving triage metrics, the system pushes a payload into the `eitr_visits` event cycle with a status of `Waiting`.
* The Midwife dashboard should show a real-time list sorted by `visit_date ASC`. However, **do not enforce programmatic sequential locks**. The midwife must be capable of clicking any patient container in the queue array at any time to alter triage order dynamically for emergency use cases.

### Phase C: Clinical Entry & Background TCL Aggregation

* **Form Structure:** Implement the e-ITR within the midwife portal as a **Multi-Step Wizard** with persistent state caching via browser `IndexedDB`.
* **The Dynamic Program Trigger:** When a midwife enters a diagnosis code matching a specific health program (e.g., `Prenatal Care`), the UI must dynamically display targeted input elements (like LMP/EDC inputs) that bind directly into the `program_specific_data` JSONB column.
* **Event Generation:** Saving a complete consultation session must emit a webhook or a Postgres database function invocation that dynamically records the data into high-level aggregated charts, completely removing manual tally counts for monthly FHSIS reporting.

### Phase D: Asynchronous Emerging Disease Validation (CHO Gateway)

* If a clinic selects `"Other / Emerging Disease"`, the record finishes local client side checkout immediately to prevent operational lag.
* The backend engine duplicates the clinical summary into `emerging_disease_registry` under a `Pending Validation` tag.
* **The CHO Interface:** Provide a dedicated configuration view for `role = cho` allowing administrators to merge disparate entries (e.g., consolidating raw strings `"Hanta Virus"`, `"Hantavirus"`, and `"Hanta-virus"` under the single official surveillance registry record `"Hantavirus Pulmonary Syndrome"`). Approved updates must cascade across the active dropdown menus across all 32 health stations dynamically.

---

## 5. Analytics & Prediction Directives

* **GIS Heatmaps:** Georeferenced map visualization components must compute coordinates by executing a relational lookup from `eitr_visits.resident_id` $\rightarrow$ `residents.household_id` $\rightarrow$ `households.latitude/longitude`.
* **ML Outbreak Anomaly Alerting:** Build anomaly detection endpoints to analyze incoming triage symptom patterns (e.g., unexpected spikes in `chief_complaint` tags like "Fever" or "Diarrhea" inside a specific spatial Purok cluster over a running 48-hour calculation window) to generate predictive outbreak warnings on the CHO Dashboard.