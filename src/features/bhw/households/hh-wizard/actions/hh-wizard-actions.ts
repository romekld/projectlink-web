"use server";

import { actionClient } from "@/lib/safe-action";
import { completeHouseholdSchema } from "../data/form-schema";
import { hhWizardService } from "../services/hh-wizard-service";
import { revalidatePath } from "next/cache";

/**
 * Action to save a complete household profile (household + members).
 */
export const save_household_action = actionClient
  .schema(completeHouseholdSchema)
  .action(async ({ parsedInput }) => {
    try {
      const result = await hhWizardService.createHousehold(parsedInput);
      
      // Revalidate relevant paths
      revalidatePath("/bhw/households");
      
      return { success: true, data: result };
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred while saving the household.";
      console.error("Failed to save household:", error);
      return { 
        success: false, 
        error: message 
      };
    }
  });

/**
 * Action to get BHW station info (useful for pre-population in Client Components).
 */
export const get_bhw_station_info_action = actionClient
  .action(async () => {
    return await hhWizardService.getBhwStationInfo();
  });
