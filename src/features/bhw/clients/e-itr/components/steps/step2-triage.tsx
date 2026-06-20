"use client"

import { Header } from "../layout/header"
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { InputField } from "@/components/shared/field-input"
import { IdCard, MapPin, Fingerprint } from "lucide-react"

export function Step2Triage() {
    return (
        <>
            <Header title="Step 2: Profile Verification" description="Review and confirm the resident's registered information before proceeding." />

            <section className="p-4 flex flex-col gap-4">
                <FieldSet>
                    <FieldLegend>Personal Information</FieldLegend>
                    <FieldDescription>
                        Verify the resident&apos;s identity details captured during registration.
                        Go back to Step 1 if corrections are needed.
                    </FieldDescription>
                    <FieldGroup>
                        <InputField
                            id="fullName"
                            icon={IdCard}
                            label="Full Name"
                            defaultValue="Delos Santos, Jerome Mancia Jr."
                            readOnly
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <InputField id="sex" label="Sex (Biological)" defaultValue="Male" readOnly />
                            <InputField id="dateOfBirth" label="Date of Birth" defaultValue="17 Dec 2004" readOnly />
                        </div>

                        <InputField
                            id="purok"
                            icon={MapPin}
                            label="Address"
                            defaultValue="Blk 4 Lot 44, Purok 1, Victoria Reyes"
                            readOnly
                        />
                    </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                <FieldSet>
                    <FieldLegend>Government IDs</FieldLegend>
                    <FieldDescription>Registered identification numbers for primary care benefit mapping.</FieldDescription>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField id="philhealthId" icon={Fingerprint} label="PhilHealth ID" defaultValue="12-123456789-0" readOnly />
                            <InputField id="nationalId" icon={Fingerprint} label="National ID Number" defaultValue="1234-12345678-1234" readOnly />
                        </div>
                    </FieldGroup>
                </FieldSet>
            </section>
        </>
    )
}
