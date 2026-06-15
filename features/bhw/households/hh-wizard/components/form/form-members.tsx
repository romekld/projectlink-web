import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GraduationCap, Church, Stethoscope, Droplets, Baby } from "lucide-react"
import { DateOfBirth } from "../date-of-birth"
import { FieldCheckbox } from "../field-checkbox"
import { SelectField } from "../select-field"
import { ComboboxField } from "../combobox-field"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "../date-picker"
import { Switch } from "@/components/ui/switch"
import * as React from "react"
import {
    sexOptions,
    civilStatusOptions,
    educationOptions,
    religionOptions,
    relationshipOptions,
    membershipTypeOptions,
    philhealthCategoryOptions,
    medicalHistoryOptions,
    waterSourceOptions,
    toiletFacilityOptions,
    fpMethodOptions,
    fpStatusOptions,
} from "../../data"
import { autoSuggestClassification } from "../../data/classification"

export function MembersForm() {
    const [sex, setSex] = React.useState<string>("")
    const [dateOfBirth, setDateOfBirth] = React.useState<string>("")

    const classification = React.useMemo(() => {
        if (!dateOfBirth || !sex) return null
        return autoSuggestClassification(dateOfBirth, sex as "M" | "F")
    }, [dateOfBirth, sex])

    const isWRA = classification === "WRA"
    const isFemale = sex === "female"
    return (
        <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldDescription>This appears on invoices and emails.</FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                    <Input id="lastName" placeholder="Dela Cruz" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                    <Input id="firstName" placeholder="Juanita Ligaya" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
                    <Input id="middleName" placeholder="Optional" />
                </Field>
                <SelectField
                    label="Relationship to Household Head *"
                    placeholder="Select relationship"
                    options={relationshipOptions}
                    showAbbreviation
                />
                <Field>
                    <FieldLabel htmlFor="specifyRelation">Specify Relation</FieldLabel>
                    <Input id="specifyRelation" placeholder="Input relation" />
                </Field>
                <div className="flex gap-3">
                    <DateOfBirth className="w-50" onDateChange={setDateOfBirth} />
                    <Field className="w-50">
                        <FieldLabel htmlFor="age">Age *</FieldLabel>
                        <Input id="age" placeholder="Auto-generated" readOnly value="21 yrs & 5mons" />
                    </Field>
                </div>
                <div className="flex gap-3">
                    <SelectField
                        label="Sex *"
                        placeholder="Select sex"
                        options={sexOptions}
                        showAbbreviation
                        onValueChange={setSex}
                    />
                    <SelectField
                        label="Civil Status *"
                        placeholder="Select civil status"
                        options={civilStatusOptions}
                        showAbbreviation
                    />
                </div>
                <ComboboxField
                    label="Educational Attainment"
                    placeholder="Select educational attainment"
                    options={educationOptions}
                    icon={GraduationCap}
                    showAbbreviation
                />
                <ComboboxField
                    label="Religion"
                    placeholder="Select religion"
                    options={religionOptions}
                    icon={Church}
                    showAbbreviation={false}
                />
                <FieldSeparator />
                <FieldCheckbox />
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Philhealth Information</FieldLegend>
                    <FieldDescription>Philhealth membership details.</FieldDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="philhealthId">Philhealth ID Number</FieldLabel>
                            <Input id="philhealthId" placeholder="Enter Philhealth ID" />
                        </Field>
                        <SelectField
                            label="Membership Type"
                            placeholder="Select membership type"
                            options={membershipTypeOptions}
                            showAbbreviation
                        />
                        <SelectField
                            label="Philhealth Category"
                            placeholder="Select category"
                            options={philhealthCategoryOptions}
                        />
                    </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Medical History *</FieldLegend>
                    <FieldDescription>Select applicable medical conditions.</FieldDescription>
                    <FieldGroup className="gap-3">
                        {medicalHistoryOptions.map((option) => (
                            <Field key={option.value} orientation="horizontal">
                                <Checkbox id={option.value} />
                                <FieldLabel htmlFor={option.value} className="font-normal">
                                    {option.code} - {option.label}
                                </FieldLabel>
                            </Field>
                        ))}
                        <Field>
                            <FieldLabel htmlFor="medicalOther">Specify Other</FieldLabel>
                            <Input id="medicalOther" placeholder="Specify other condition" />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Classification by Age/Health Risk Group *</FieldLegend>
                    <FieldDescription>Auto-computed based on age and sex.</FieldDescription>
                    <Field>
                        <FieldLabel htmlFor="classification">Classification</FieldLabel>
                        <Input id="classification" placeholder="Auto-generated" readOnly value={classification || ""} />
                    </Field>
                </FieldSet>
                {isFemale && (
                    <>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Women of Reproductive Age (WRA)</FieldLegend>
                            <FieldDescription>For females aged 15-49 years.</FieldDescription>
                            <FieldGroup>
                                {isWRA && (
                                    <Field>
                                        <FieldLabel htmlFor="lmp">Last Menstrual Period (LMP)</FieldLabel>
                                        <DatePicker onDateChange={(date) => console.log(date)} date={new Date()} />
                                        <FieldDescription>If pregnant, write LMP in yyyy-mm-dd format.</FieldDescription>
                                    </Field>
                                )}
                                <Field orientation="horizontal">
                                    <Switch id="usingFp" />
                                    <FieldLabel htmlFor="usingFp" className="font-normal">
                                        Using any FP method?
                                    </FieldLabel>
                                </Field>
                                <SelectField
                                    label="Family Planning Method used"
                                    placeholder="Select method"
                                    options={fpMethodOptions}
                                    icon={Baby}
                                />
                                <SelectField
                                    label="FP Status (if applicable) *"
                                    placeholder="Select status"
                                    options={fpStatusOptions}
                                    showAbbreviation
                                />
                            </FieldGroup>
                        </FieldSet>
                    </>
                )}
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Facility Information *</FieldLegend>
                    <FieldDescription>Water source and toilet facility details.</FieldDescription>
                    <FieldGroup>
                        <SelectField
                            label="Type of Water Source *"
                            placeholder="Select water source"
                            options={waterSourceOptions}
                            icon={Droplets}
                            showAbbreviation
                        />
                        <SelectField
                            label="Type of Toilet Facility *"
                            placeholder="Select toilet facility"
                            options={toiletFacilityOptions}
                            icon={Stethoscope}
                            showAbbreviation
                        />
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </FieldSet>
    )
}