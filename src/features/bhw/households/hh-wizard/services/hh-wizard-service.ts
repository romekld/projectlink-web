import { createClient } from "@/lib/supabase/server";
import { CompleteHouseholdValues, HouseholdValues, MemberValues } from "../data/form-schema";
import { DbHouseholdInsert, DbHouseholdMemberInsert } from "../types/hh-wizard-types";

/**
 * Service to handle Household Profiling data operations.
 */
export const hhWizardService = {
  /**
   * Creates a new household and its members in Supabase.
   */
  async createHousehold(data: CompleteHouseholdValues) {
    const supabase = await createClient();
    const { household, members } = data;

    // 1. Get current user (BHW)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized: User not found");

    // 2. Insert Household
    const householdInsert: DbHouseholdInsert = {
      visit_date: household.visitDate,
      quarter: household.quarter,
      barangay_id: household.barangayId,
      house_no_street: household.houseNoStreet,
      purok: household.purok,
      enumeration_area: household.enumerationArea,
      family_count: household.familyCount,
      respondent_last_name: household.respondentLastName,
      respondent_first_name: household.respondentFirstName,
      respondent_middle_name: household.respondentMiddleName,
      water_source: household.waterSource,
      toilet_facility: household.toiletFacility,
      assigned_bhw_id: user.id,
      sync_status: "pending_validation",
    };

    const { data: hhData, error: hhError } = await supabase
      .from("households")
      .insert(householdInsert)
      .select()
      .single();

    if (hhError) throw hhError;

    // 3. Insert Members
    const membersInsert: DbHouseholdMemberInsert[] = members.map((m) => ({
      household_id: hhData.id,
      last_name: m.lastName,
      first_name: m.firstName,
      middle_name: m.middleName,
      birthdate: m.birthdate,
      sex: m.sex,
      relationship: m.relationship,
      civil_status: m.civilStatus,
      nhts_status: m.nhtsStatus,
      four_ps_id: m.fourPsId,
      philhealth_id: m.philhealthId,
      ph_category: m.phCategory,
      medical_history: m.medicalHistory,
      classification: m.classification,
      is_pregnant: m.isPregnant,
      lmp: m.lmp,
      using_fp: m.usingFp,
      fp_method: m.fpMethod,
      education: m.education,
      religion: m.religion,
      metadata: m.metadata,
    }));

    const { error: membersError } = await supabase
      .from("household_members")
      .insert(membersInsert);

    if (membersError) {
      // Note: In a real production app, you might want to wrap this in a RPC or use a transaction 
      // if your Supabase setup supports it, to avoid orphaned household records.
      // For now, we'll throw and handle the error.
      throw membersError;
    }

    return { household: hhData };
  },

  /**
   * Fetches the BHW's assigned health station and its barangay.
   */
  async getBhwStationInfo() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`
        health_station_id,
        health_stations (
          id,
          name,
          station_code,
          barangay_id,
          city_barangays (
            id,
            name
          )
        )
      `)
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;
    return profile;
  }
};
