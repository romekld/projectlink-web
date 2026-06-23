
import { HouseholdInfoForm } from "../forms/form-household-info"
import { Header } from "../layout/header"

export function Step1HouseholdInfo() {
    return (
        <>
            {/* Step 1: Basic Information */}
            <Header title="Step 1: Household Profile" description="Enter the household's basic information." />

            <section className="p-6 flex flex-col gap-4">
                <HouseholdInfoForm />
                {/* <MemberInfoForm /> */}
            </section>

        </>
    )
}
