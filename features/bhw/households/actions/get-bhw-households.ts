"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  Household,
  HouseholdMember,
  SyncStatus,
  NhtsStatus,
  PhilHealthCategory,
  RelationshipToHead,
  ClassificationCode,
  Sex,
} from "@/features/bhw/households/data/schema"
import type { Database } from "@/lib/supabase/database.types"

type HouseholdRow = Database["public"]["Tables"]["households"]["Row"]
type MemberRow = Database["public"]["Tables"]["household_members"]["Row"]

function mapMember(row: MemberRow): HouseholdMember {
  return {
    id: row.id,
    memberLastName: row.member_last_name,
    memberFirstName: row.member_first_name,
    memberMiddleName: row.member_middle_name ?? undefined,
    memberMothersMaidenName: row.member_mothers_maiden_name ?? undefined,
    relationshipToHhHead: row.relationship_to_hh_head as RelationshipToHead,
    sex: row.sex as Sex,
    dateOfBirth: row.date_of_birth,
    dobEstimated: row.dob_estimated,
    classificationQ1: (row.classification_q1 as ClassificationCode) ?? undefined,
    classificationQ2: (row.classification_q2 as ClassificationCode) ?? undefined,
    classificationQ3: (row.classification_q3 as ClassificationCode) ?? undefined,
    classificationQ4: (row.classification_q4 as ClassificationCode) ?? undefined,
    memberPhilhealthId: row.member_philhealth_id ?? undefined,
    memberRemarks: row.member_remarks ?? undefined,
  }
}

function mapHousehold(row: HouseholdRow & { household_members: MemberRow[] }): Household {
  return {
    id: row.id,
    householdNumber: row.household_number ?? "",
    healthStationId: row.health_station_id ?? "",
    assignedBhwId: row.assigned_bhw_id ?? "",
    respondentLastName: row.respondent_last_name,
    respondentFirstName: row.respondent_first_name,
    respondentMiddleName: row.respondent_middle_name ?? undefined,
    nhtsStatus: row.nhts_status as NhtsStatus,
    isIndigenousPeople: row.is_indigenous_people,
    hhHeadPhilhealthMember: row.hh_head_philhealth_member,
    hhHeadPhilhealthId: row.hh_head_philhealth_id ?? undefined,
    hhHeadPhilhealthCategory: (row.hh_head_philhealth_category as PhilHealthCategory) ?? undefined,
    visitDateQ1: row.visit_date_q1 ?? undefined,
    visitDateQ2: row.visit_date_q2 ?? undefined,
    visitDateQ3: row.visit_date_q3 ?? undefined,
    visitDateQ4: row.visit_date_q4 ?? undefined,
    year: row.year,
    syncStatus: row.sync_status as SyncStatus,
    returnedReason: row.returned_reason ?? undefined,
    members: (row.household_members ?? []).map(mapMember),
    lastUpdated: row.updated_at,
  }
}

export async function getBhwHouseholds(): Promise<Household[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("households")
    .select("*, household_members(*)")
    .eq("assigned_bhw_id", user.id)
    .order("updated_at", { ascending: false })

  if (error || !data) return []

  return (data as unknown as (HouseholdRow & { household_members: MemberRow[] })[]).map(
    mapHousehold
  )
}
