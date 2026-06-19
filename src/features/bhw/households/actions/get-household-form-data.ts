"use server"

import { barangayService } from "@/features/bhw/households/hh-wizard/services/barangay-service"

export type HouseholdFormData = Awaited<ReturnType<typeof barangayService.getBarangayOptions>>

export async function getHouseholdFormData(): Promise<HouseholdFormData> {
  return await barangayService.getBarangayOptions()
}
