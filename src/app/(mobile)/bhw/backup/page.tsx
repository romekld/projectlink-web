// import { HhProfileWizard } from "@/features/bhw/households/hh-profile-wizard"
// import { getHouseholdFormData } from "@/features/bhw/households/actions/get-household-form-data"

export default async function Page() {
  // const { barangays, defaultBarangayId } = await getHouseholdFormData()

  return (
    // <HhProfileWizard
    //   mode="create"
    //   quarterLabel="Q2 2026"
    //   barangays={barangays}
    //   defaultBarangayId={defaultBarangayId}
    // />
    <div className="p-4">
      <h1 className="text-2xl font-bold">Household Profile Wizard</h1>
      <p className="mt-2 text-gray-600">This is a placeholder for the Household Profile Wizard.</p>
    </div>
  )
}
