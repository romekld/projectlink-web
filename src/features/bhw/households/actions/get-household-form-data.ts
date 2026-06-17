"use server"

import { barangayService, type HouseholdFormData } from "@/features/bhw/households/hh-wizard/services/barangay-service"

export async function getHouseholdFormData(): Promise<HouseholdFormData> {
  return await barangayService.getBarangayOptions()
}
