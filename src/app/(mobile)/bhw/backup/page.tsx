import { HhProfileWizard } from "@/features/bhw/households/hh-profile-wizard"
import { getHouseholdFormData } from "@/features/bhw/households/actions/get-household-form-data"

export default async function Page() {
  const { barangays, defaultBarangayId } = await getHouseholdFormData()

  return (
    <HhProfileWizard
      mode="create"
      quarterLabel="Q2 2026"
      barangays={barangays}
      defaultBarangayId={defaultBarangayId}
    />
  )
}
