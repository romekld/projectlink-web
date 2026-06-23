import { autoSuggestClassification } from "../options/classification"

/* ------------------------------------------------------------------ */
/*  Types — DB-ready shapes                                           */
/* ------------------------------------------------------------------ */

export interface HouseholdInsert {
  barangay_id: string
  house_no_street: string | null
  purok: string | null
  family_count: number
  respondent_last_name: string
  respondent_first_name: string
  respondent_middle_name: string | null
  water_source: string
  toilet_facility: string
  visit_date: string
  nhts_status: string
  is_indigenous: boolean
  latitude: number | null
  longitude: number | null
  assigned_bhw_id: string
}

export interface ResidentInsert {
  last_name: string
  first_name: string
  middle_name: string | null
  birthdate: string
  sex: string
  relationship: string
  civil_status: string
  education: string | null
  religion: string | null
  nhts_status: string
  four_ps_id: string | null
  is_indigenous: boolean
  is_philhealth_member: boolean
  philhealth_id: string | null
  philhealth_membership_type: string | null
  philhealth_category: string | null
  medical_history: string[]
  classification: string
  is_pregnant: boolean
  lmp: string | null
  using_fp: boolean
  fp_methods: string[]
  fp_status: string | null
}

export interface SubmissionPayload {
  household: HouseholdInsert
  residents: ResidentInsert[]
}

/* ------------------------------------------------------------------ */
/*  Transform                                                         */
/* ------------------------------------------------------------------ */

interface FormMember {
  lastName: string
  firstName: string
  middleName?: string | null
  sex: "male" | "female"
  dateOfBirth?: string | null
  relationship: string
  civilStatus: string
  education?: string | null
  religion?: string | null
  is4ps: boolean
  is4psId?: string | null
  isIndigenous: boolean
  isPhilhealthMember: boolean
  philhealthId?: string | null
  philhealthMembershipType?: string | null
  philhealthCategory?: string | null
  medicalHistory?: string[]
  isPregnant?: boolean | null
  lmpDate?: string | null
  usingFP: boolean
  fpMethods?: string[]
  fpStatus?: string | null
}

interface FormData {
  barangay: string
  addressLine1?: string | null
  addressLine2?: string | null
  familyCount: number
  respondentLastName: string
  respondentFirstName: string
  respondentMiddleName?: string | null
  waterSource: string
  toiletFacility: string
  is4ps: boolean
  is4psId?: string | null
  isIndigenous: boolean
  latitude?: number | null
  longitude?: number | null
  visitDate?: string | null
  members?: FormMember[]
}

export function getSubmissionPayload(
  form: FormData,
  assignedBhwId: string,
): SubmissionPayload {
  const household: HouseholdInsert = {
    barangay_id: form.barangay,
    house_no_street: form.addressLine1 ?? null,
    purok: form.addressLine2 ?? null,
    family_count: form.familyCount,
    respondent_last_name: form.respondentLastName,
    respondent_first_name: form.respondentFirstName,
    respondent_middle_name: form.respondentMiddleName ?? null,
    water_source: form.waterSource,
    toilet_facility: form.toiletFacility,
    visit_date: form.visitDate ?? "",
    nhts_status: form.is4ps ? "4Ps" : "Non-4Ps",
    is_indigenous: form.isIndigenous,
    latitude: form.latitude ?? null,
    longitude: form.longitude ?? null,
    assigned_bhw_id: assignedBhwId,
  }

  const residents: ResidentInsert[] = (form.members ?? []).map((m) => {
    const sex = m.sex === "male" ? "M" : "F"
    const classification =
      autoSuggestClassification(m.dateOfBirth ?? "", sex) ?? "Adult"

    return {
      last_name: m.lastName,
      first_name: m.firstName,
      middle_name: m.middleName ?? null,
      birthdate: m.dateOfBirth ?? "",
      sex,
      relationship: m.relationship,
      civil_status: m.civilStatus,
      education: m.education ?? null,
      religion: m.religion ?? null,
      nhts_status: m.is4ps ? "4Ps" : "Non-4Ps",
      four_ps_id: m.is4psId || null,
      is_indigenous: m.isIndigenous,
      is_philhealth_member: m.isPhilhealthMember,
      philhealth_id: m.philhealthId || null,
      philhealth_membership_type: m.philhealthMembershipType || null,
      philhealth_category: m.philhealthCategory || null,
      medical_history: m.medicalHistory ?? [],
      classification,
      is_pregnant: m.isPregnant ?? false,
      lmp: m.lmpDate || null,
      using_fp: m.usingFP,
      fp_methods: m.fpMethods ?? [],
      fp_status: m.fpStatus || null,
    }
  })

  return { household, residents }
}
