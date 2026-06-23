"use server"

import { createClient } from "@/lib/supabase/server"
import { getSubmissionPayload } from "../services/submit-household"
import type { SubmissionPayload } from "../services/submit-household"

export type SubmitResult =
  | { success: true; householdId: string; householdNumber: string | null; payload: SubmissionPayload }
  | { success: false; error: string; payload?: SubmissionPayload }

/* ------------------------------------------------------------------ */
/*  Internal DB types                                                  */
/* ------------------------------------------------------------------ */

interface DbHouseholdInsert {
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

interface DbResidentInsert {
  household_id: string
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

/* ------------------------------------------------------------------ */
/*  Server Action                                                      */
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

interface RawForm {
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

export async function submitHouseholdAction(raw: RawForm): Promise<SubmitResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const payload = getSubmissionPayload(raw, user.id)

  const householdData: DbHouseholdInsert = {
    ...payload.household,
    assigned_bhw_id: user.id,
  }

  const { data: household, error: hhError } = await supabase
    .from("households")
    .insert(householdData)
    .select("id, household_number")
    .single()

  if (hhError || !household) {
    return { success: false, error: hhError?.message ?? "Failed to create household", payload }
  }

  const residentsData: DbResidentInsert[] = payload.residents.map((r) => ({
    ...r,
    household_id: household.id,
  }))

  const { error: resError } = await supabase
    .from("residents")
    .insert(residentsData)

  if (resError) {
    return { success: false, error: resError.message, payload }
  }

  return {
    success: true,
    householdId: household.id,
    householdNumber: household.household_number,
    payload,
  }
}
