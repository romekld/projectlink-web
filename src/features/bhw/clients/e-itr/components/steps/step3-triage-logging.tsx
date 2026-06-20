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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Heart, Thermometer, Weight, Ruler, Activity, Stethoscope } from "lucide-react"

const COMPLAINT_TAGS = [
    { value: "ubo-sipon", label: "Ubo / Sipon" },
    { value: "lagnat", label: "Lagnat" },
    { value: "pagtatae", label: "Pagtatae" },
    { value: "sakit-ulo", label: "Sakit ng Ulo / Katwan" },
    { value: "prenatal", label: "Konsulta sa Buntis" },
    { value: "bakuna", label: "Bakuna" },
]

export function Step3TriageLogging() {
    return (
        <>
            <Header title="Step 3: Triage & Vitals" description="Assess the resident's condition and record vital signs for FHSIS reporting." />

            <section className="p-4 flex flex-col gap-4">
                <FieldSet>
                    <FieldLegend>Chief Complaint</FieldLegend>
                    <FieldDescription>Select the reason for consultation or enter a custom complaint.</FieldDescription>
                    <FieldGroup>
                        <ToggleGroup type="multiple" variant="outline" className="flex-wrap">
                            {COMPLAINT_TAGS.map((tag) => (
                                <ToggleGroupItem key={tag.value} value={tag.value}>
                                    {tag.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <InputField
                            id="chiefComplaint"
                            label="Other Complaint"
                            icon={Stethoscope}
                            placeholder="Type the chief complaint..."
                        />
                    </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                <FieldSet>
                    <FieldLegend>Vital Signs</FieldLegend>
                    <FieldDescription>
                        Record the resident&apos;s current vital measurements.
                        These metrics flag high-risk thresholds and support FHSIS syndrome surveillance.
                    </FieldDescription>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField
                                id="bloodPressureSystolic"
                                label="Systolic BP (mmHg)"
                                icon={Heart}
                                type="number"
                                placeholder="120"
                            />
                            <InputField
                                id="bloodPressureDiastolic"
                                label="Diastolic BP (mmHg)"
                                type="number"
                                placeholder="80"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <InputField
                                id="temperature"
                                label="Body Temperature (°C)"
                                icon={Thermometer}
                                type="number"
                                step="0.1"
                                placeholder="37.5"
                            />
                            <InputField
                                id="weight"
                                label="Weight (kg)"
                                icon={Weight}
                                type="number"
                                step="0.1"
                                placeholder="65.5"
                            />
                        </div>

                        <InputField
                            id="height"
                            label="Height / Length (cm)"
                            icon={Ruler}
                            type="number"
                            step="0.1"
                            placeholder="165.0"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <InputField
                                id="pulseRate"
                                label="Pulse Rate (bpm)"
                                icon={Activity}
                                type="number"
                                placeholder="72"
                            />
                            <InputField
                                id="respiratoryRate"
                                label="Respiratory Rate (cpm)"
                                type="number"
                                placeholder="16"
                            />
                        </div>
                    </FieldGroup>
                </FieldSet>
            </section>
        </>
    )
}
