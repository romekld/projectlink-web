# Project LINK — Implementation Todo List

## Module 1: Household & Resident Management (BHW Focus)

* [x] **Household List View** (`/households`)
* [x] Implement responsive data table/card layout for mobile PWA view.
* [x] Add filters for Barangay and Purok/Sitio clusters.
* [x] Include search bar mapping to `household_number` or Household Head.


* [x] **New Household Registration Form** (`/households/new`)
* [x] Multi-step or logical section layout (Dwelling Info $\rightarrow$ Environmental/FHSIS Metrics).
* [x] Integrate HTML5 Geolocation API to auto-capture latitude and longitude coordinates.
* [x] Enforce standardized select options for FHSIS metrics (`water_source`, `toilet_type`).


* [ ] **Household Details Page** (`/households/[id]`)
* [ ] View summary cards of household environmental indicators.
* [ ] Display a sub-list component showing all currently mapped members.
* [ ] Add `[ Link Existing Resident ]` button to handle shifting family members.


* [ ] **Master Resident Directory / Search View** (`/residents`)
* [ ] High-density, mobile-tailored Card List component UI (No wide tables on mobile screens).
* [ ] Design verification cards showing: `LAST NAME, FIRST NAME`, `Age/DOB`, `Sex`, and `Purok`.
* [ ] Add **"Quick Register" Escape Hatch** floating action button.


* [ ] **Quick Register Modal Component**
* [ ] Create minimized input form capturing only: First Name, Last Name, DOB, and Sex.
* [ ] Backend logic to save record with `is_temporary = true` and `household_id = null`.


* [ ] **Data Reconciliation Dashboard** (`/reconciliation`)
* [ ] View listing all residents flagged with `is_temporary = true`.
* [ ] Add workflow action to map the temporary resident permanently to a valid `household_id`.



---

## Module 2: Triage & Queuing (BHW to Midwife Hand-off)

* [ ] **BHW Patient Triage Wizard Flow** (`/triage/new?resident_id=[id]`)
* [ ] **Step 1: Locked Demographic Verification Card**
* [ ] Display single string text block: `Name: LAST NAME, FIRST NAME (Age) • Sex`.
* [ ] Create `[ Edit Profile ]` override button popping open separate modifiable fields modal.


* [ ] **Step 2: Vitals & Chief Complaint Input**
* [ ] Add responsive input elements for Weight, Height, Temp, BP, Pulse, and Respiratory rates.
* [ ] Implement rapid-tap predictive "FHSIS Quick-Tags" layout for Chief Complaints (`Ubo`, `Lagnat`, `Buntis`, etc.).
* [ ] Implement color-coded threshold triggers (e.g., flash input red if Temp $\ge$ 38°C or BP $\ge$ 140/90).


* [ ] **Step 3: Route Summary & Check-In**
* [ ] Review verified details.
* [ ] Add Priority Toggle (`Regular` vs `Urgent/Priority`) for senior/pediatric/maternal cases.
* [ ] Button: `[ Send to Midwife Queue ]` to initialize an immutable `eitr_visits` event instance.




* [ ] **Real-Time Consultation Queue Dashboard** (`/queue`)
* [ ] Setup Supabase real-time subscription listener watching active `eitr_visits` queue array.
* [ ] Ensure non-linear operational override: Midwives can select *any* card in the queue list out of chronological order.
* [ ] Visual indicators tracking queue statuses: `Waiting`, `In Consultation`, `Completed`, `Referred`.



---

## Module 3: Clinical Documentation & Automation (Midwife Portal)

* [ ] **Midwife Clinical Consultation Portal** (`/consultation/[visit_id]`)
* [ ] Build **High-Density Multi-Step UI Wizard** with persistent browser auto-save state via `IndexedDB`.
* [ ] **Wizard Step 1: Historical Profile & Triage Review**
* [ ] Pull historical diagnosis log charts and triage vital benchmarks recorded by BHW.


* [ ] **Wizard Step 2: Physical Exam Matrix**
* [ ] Build high-density rapid-select checkboxes for major physiological systems to eliminate manual typing.


* [ ] **Wizard Step 3: Diagnostic Selection & Conditional FHSIS TCL Triggers**
* [ ] Integrate searchable drop-down lookup linked to standardized ICD-10 codes / FHSIS Morbidity categories.
* [ ] Implement frontend conditional compiler logic: *If diagnosis == "Prenatal Care", render sub-forms for LMP, EDC, Gravida/Para.* Save variables into `program_specific_data` JSONB cell.


* [ ] **Wizard Step 4: Disposition & Finalization**
* [ ] Capture treatment logs and medicine dispensing linked to clinic inventory drop-downs.
* [ ] Button: `[ Finalize and Close e-ITR ]` to set queue status to `Completed` and lock encounter history.





---

## Module 4: Surveillance & City Governance (CHO Portal)

* [ ] **CHO Consolidated Analytics Hub** (`/cho/dashboard`)
* [ ] Build MapLibre / PostGIS integration layers parsing geo-coordinates via relational paths (`visit` $\rightarrow$ `resident` $\rightarrow$ `household`).
* [ ] Implement real-time disease spatial **GIS Heatmaps** plotting tracking points.
* [ ] Develop basic Backend Anomaly Detection Endpoint: Scans running 48-hour calculation matrices for spikes in matching chief complaints or diagnoses within tight spatial radiuses.


* [ ] **Emerging Disease Validation Gate** (`/cho/surveillance`)
* [ ] Table view capturing entries flagged with `is_emerging_disease = true`.
* [ ] Merge management interface: Action allowing the CHO to select multiple free-text inputs (e.g., *"Hantavirus"*, *"Hanta virus"*) and map them down under a single official surveillance dictionary profile.
* [ ] Implement async configuration tool to push newly approved terminology choices down into all 32 local BHS UI dropdown fields instantly.


* [ ] **FHSIS Report Generator Engine** (`/cho/reports`)
* [ ] Build database summary aggregation matrix queries calculating programmatic statistics from the `program_specific_data` JSONB logs.
* [ ] Add filtering matrices to slice demographic totals at the Barangay, Municipal, or City level.
* [ ] Export features providing clean, ready-to-print DOH-compliant ledger files.



---

## Module 5: BHS Local Offline Network (LAN Layer)

* [ ] **BHS Local Network Framework**
* [ ] Setup local Wi-Fi router deployment profiles (Zero-internet infrastructure requirements).
* [ ] Configure client-side PWA framework to dynamically parse local gateway IP configurations (e.g., `http://192.168.1.100:5000` linking to the midwife's master laptop station server instance).
* [ ] Implement **Client-Side UUID Generation Engine**: Ensure any database insertions (`id`) are written as robust random UUIDs client-side to mitigate syncing overwrites during offline execution.
* [ ] Build **Background Replication Engine Script** (via RxDB, PouchDB, or custom worker queries) that caches database logs inside client side storage, queue transactions, and automatically executes asynchronous reconciliation upward to the cloud instance once a web signal is re-established.