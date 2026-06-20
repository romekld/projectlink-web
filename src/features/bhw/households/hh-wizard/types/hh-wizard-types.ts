import { Database } from "@/lib/supabase/database.types";

export type DbHousehold = Database["public"]["Tables"]["households"]["Row"];
export type DbHouseholdInsert = Database["public"]["Tables"]["households"]["Insert"];
export type DbHouseholdMember = Database["public"]["Tables"]["household_members"]["Row"];
export type DbHouseholdMemberInsert = Database["public"]["Tables"]["household_members"]["Insert"];

export type ClassificationCode = Database["public"]["Enums"]["classification_code"];
export type NhtsStatus = Database["public"]["Enums"]["nhts_status"];
export type PhilhealthCategory = Database["public"]["Enums"]["philhealth_category"];
export type HhSyncStatus = Database["public"]["Enums"]["hh_sync_status"];

export interface HouseholdWithMembers extends DbHousehold {
  members: DbHouseholdMember[];
}
