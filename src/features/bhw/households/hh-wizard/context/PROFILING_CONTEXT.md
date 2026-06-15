# Household Profiling Context and Guidelines

This document serves as the comprehensive context for developing the digital Household Profiling form. It is based on the Department of Health (DOH) Field Health Services Information System (FHSIS) Manual of Procedures (2018) and subsequent memorandums.

## 1. Overview and Purpose
Household profiling is a systematic process of gathering health and socio-demographic data from every household in a catchment area. This data is used by midwives and health officers to:
- Identify health risks within the community.
- Master-list clients for various health programs (Maternal, Child, Immunization, etc.).
- Monitor living conditions (water, sanitation).
- Track progress of public health interventions.

## 2. The Profiling Process
### Schedule and Updates
- **Initial Profiling:** Conducted and completed at the beginning of the year (January).
- **Quarterly Updates:** Updated at the end of the first month of every quarter (April, July, October).
- **Target:** Ideally, one Barangay Health Worker (BHW) covers **20-25 households**.

### Workflow
1. **Assignment:** The Midwife (MW) assigns specific households/areas to BHWs, NDPs, or volunteers.
2. **Data Collection:** BHWs visit households and interview a respondent (usually the household head or spouse).
3. **Submission:** Accomplished profiles are submitted to the supervising Midwife by the **third week** of the first month of the quarter.
4. **Validation:** The Midwife reviews and compiles profiles to create program master lists.

---

## 3. Required Fields: Digital Form Structure

### 3.1 Metadata (Form Header)
- **Date of Visit:** (Required) Format: `YYYY-MM-DD`.
- **Household Number:** (Required) Format: `YYYYMM-FacilityCode-No(00000)`. *Note: Facility Code is provided by KMITS.*
- **Barangay:** (Required) The specific barangay where the HH is located.
- **Enumeration Area (EA):** Useful for large barangays divided into segments.
- **Family Count:** Number of families living within the single household.
- **Interviewed by:** Name of the BHW/Enumerator.
- **Reviewed by:** Name of the Supervising Midwife.

### 3.2 Member-Level Information
A household consists of multiple members. The list should start with the **Household Head**, followed by the spouse, children (eldest to youngest), and other relatives/members.

| Field | Requirement | Format/Options |
| :--- | :--- | :--- |
| **Last Name** | Required | String |
| **First Name** | Required | String |
| **Middle Name** | Required | String (Mother's Maiden Name) |
| **Relationship to Head** | Required | Head, Spouse, Son, Daughter, Other (specify) |
| **Birthdate** | Required | `YYYY-MM-DD` |
| **Age** | Required | Calculated from Birthdate (Years and Months) |
| **Sex** | Required | Male (M), Female (F) |
| **Civil Status** | Required | Single (S), Married (M), Live-in (L), Widow/er (W), Separated (SP), Cohabitation (C) |
| **Education** | Optional | Educational Attainment level |
| **Religion** | Optional | Religion name |
| **Ethnicity** | Required | IP (Indigenous People) or Non-IP |
| **4Ps Member** | Required | Boolean (Yes/No). If Yes, provide **4Ps Household ID No.** |

### 3.3 Health and Insurance
| Field | Requirement | Format/Options |
| :--- | :--- | :--- |
| **Philhealth ID** | Optional | Philhealth Number of the member |
| **Membership Type** | Optional | Member (M) or Dependent (D) |
| **Philhealth Category** | Required | Direct Contributor (DC), Indirect Contributor (IC), Unknown (U) |
| **Medical History** | Required | Allergy, Illness (HPN, DM, TB), Surgery, Immunization, Others (specify) |
| **Classification** | Required | Droplist (Infant, Child, Adolescent, WRA, Pregnant, Senior, etc.) |

### 3.4 Maternal Health & Family Planning
*Only applicable for Women of Reproductive Age (WRA) or Pregnant members.*

- **Last Menstrual Period (LMP):** Required if pregnant. Format: `YYYY-MM-DD`.
- **Using FP Method?** Required for WRA. (Yes/No).
- **FP Method Used:** If Yes, specify (Pills, IUD, Condom, DPT, Withdrawal, SDM, etc.).
- **FP Status:** (e.g., User, Non-user, etc.)

---

## 4. Environmental Health (Household Level)
These fields apply to the entire household, not individual members.

### 4.1 Type of Water Source (Required)
- **Level I (Point Source):** Protected well/developed spring without distribution system. (Serves ~15 HHs).
- **Level II (Communal Faucet):** Piped distribution with communal faucets. (1 faucet serves 4-6 HHs).
- **Level III (Individual Connection):** Piped distribution with individual household taps.

### 4.2 Type of Toilet Facility (Required)
- **Sanitary Toilet Facility:**
    - Ventilated Improved Pit (VIP) / Composting Toilet.
    - Pour/Flush toilet connected to Septic Tank.
    - Pour/Flush toilet connected to Septic Tank and Sewerage System.
- **Unsanitary Toilet Facility:**
    - Water-sealed connected to open drain.
    - Overhung latrine.
    - Open-pit latrine.
    - Without toilet (Open defecation).

---

## 5. Implementation Notes for Digital Form
1. **Dynamic Rows:** The form must allow adding/removing members dynamically within a single Household entry.
2. **Conditional Logic:** 
    - If "4Ps Member" is Yes -> Show "4Ps ID" field.
    - If "Sex" is Female and "Age" is within WRA range -> Show Family Planning/LMP section.
3. **Calculated Fields:** Age should be auto-calculated upon entering the Birthdate.
4. **Validation:** Ensure the Date of Visit is not in the future and follow the specified format for Household Number.
5. **Lookup Support:** Provide dropdowns for Civil Status, Philhealth Category, Ethnicity, Water Source, and Toilet Facility to ensure data consistency.
