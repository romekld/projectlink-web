import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/database.types";
import { CompleteHouseholdValues } from "../data/form-schema";
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
      year: household.year,
      respondent_last_name: household.respondentLastName,
      respondent_first_name: household.respondentFirstName,
      respondent_middle_name: household.respondentMiddleName,
      barangay_id: household.barangayId,
      house_no_street: household.houseNoStreet,
      purok: household.purok,
      assigned_bhw_id: user.id,
      sync_status: "pending_validation",
    };

    // Set the appropriate quarter visit date based on quarter value
    const quarterField = `visit_date_q${household.quarter}` as keyof DbHouseholdInsert;
    (householdInsert as Record<string, unknown>)[quarterField] = household.visitDate;

    const { data: hhData, error: hhError } = await supabase
      .from("households")
      .insert(householdInsert)
      .select()
      .single();

    if (hhError) throw hhError;

    // 3. Insert Members
    const membersInsert: DbHouseholdMemberInsert[] = members.map((m) => {
      const memberInsert: DbHouseholdMemberInsert = {
        household_id: hhData.id,
        member_last_name: m.lastName,
        member_first_name: m.firstName,
        member_middle_name: m.middleName,
        date_of_birth: m.birthdate,
        sex: m.sex,
        relationship_to_hh_head: m.relationship as Database["public"]["Enums"]["relationship_to_hh_head"],
      };

      // Set the appropriate quarter classification based on household quarter
      const classificationField = `classification_q${household.quarter}` as keyof DbHouseholdMemberInsert;
      (memberInsert as Record<string, unknown>)[classificationField] = m.classification;

      return memberInsert;
    });

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
