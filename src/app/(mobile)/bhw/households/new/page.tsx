import { HHWizard } from "@/features/bhw/households/hh-wizard"
import { getHouseholdFormData } from "@/features/bhw/households/actions/get-household-form-data"

export default async function Page() {
  const { barangays, defaultBarangayId } = await getHouseholdFormData()

  return (
    <HHWizard barangays={barangays} defaultBarangayId={defaultBarangayId} />
  )
}
