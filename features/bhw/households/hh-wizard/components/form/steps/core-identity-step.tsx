"use client"

import * as React from "react"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldSeparator,
    FieldContent,
} from "@/components/ui/field"
import { SelectField } from "../../select-field"

import { Switch } from "@/components/ui/switch"
import { GraduationCap, Church } from "lucide-react"
import { InputField } from "../../input-field"
import { DateOfBirth } from "../../date-of-birth"
import { ComboboxField } from "../../combobox-field"
import {
    relationshipOptions,
    sexOptions,
    civilStatusOptions,
    educationOptions,
    religionOptions
} from "../../../data"
import type { WizardStepProps } from "../wizard"

export function CoreIdentityStep({ data, onDataChange }: WizardStepProps) {
    const handleDobChange = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()

        let years = today.getFullYear() - date.getFullYear()
        let months = today.getMonth() - date.getMonth()
        const days = today.getDate() - date.getDate()

        if (days < 0) {
            months--
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
            const daysInLastMonth = lastMonth.getDate()
            if (days + daysInLastMonth < 0) {
                months--
            }
        }

        if (months < 0) {
            years--
            months += 12
        }

        const ageString = years > 0
            ? `${years} yrs${months > 0 ? ` & ${months} mons` : ''}`
            : `${months} mons`

        onDataChange({
            ...data,
            dateOfBirth: dateString,
            age: ageString,
        })
    }

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Personal Identity</FieldLegend>
                <FieldDescription>Legal name and relationship to the household head.</FieldDescription>
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            id="lastName"
                            label="Last Name *"
                            placeholder="e.g. Dela Cruz"
                            value={(data.lastName as string) || ""}
                            onChange={(e) => onDataChange({ ...data, lastName: e.target.value })}
                        />
                        <InputField
                            id="firstName"
                            label="First Name *"
                            placeholder="e.g. Juanita"
                            value={(data.firstName as string) || ""}
                            onChange={(e) => onDataChange({ ...data, firstName: e.target.value })}
                        />
                        <InputField
                            id="middleName"
                            label="Middle Name"
                            placeholder="Optional"
                            value={(data.middleName as string) || ""}
                            onChange={(e) => onDataChange({ ...data, middleName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ComboboxField
                            label="Relationship to Head *"
                            placeholder="Select relationship"
                            options={relationshipOptions}
                            showAbbreviation
                            value={data.relationship as string}
                            onValueChange={(value) => onDataChange({ ...data, relationship: value })}
                        />
                        {data.relationship === "5" && (
                            <InputField
                                id="specifyRelation"
                                label="Specify Relation *"
                                placeholder="Input relation"
                                value={(data.specifyRelation as string) || ""}
                                onChange={(e) => onDataChange({ ...data, specifyRelation: e.target.value })}
                                className="animate-in fade-in slide-in-from-top-2 duration-300"
                            />
                        )}
                    </div>
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Demographics</FieldLegend>
                <FieldDescription>Basic demographic details about the member.</FieldDescription>
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateOfBirth
                            onDateChange={handleDobChange}
                            value={data.dateOfBirth as string}
                        />
                        <InputField
                            id="age"
                            label="Age *"
                            placeholder="Auto-generated"
                            readOnly
                            value={(data.age as string) || ""}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Sex *"
                            placeholder="Select sex"
                            options={sexOptions}
                            showAbbreviation
                            value={data.sex as string}
                            onValueChange={(value) => onDataChange({ ...data, sex: value })}
                        />
                        <ComboboxField
                            label="Civil Status *"
                            placeholder="Select civil status"
                            options={civilStatusOptions}
                            showAbbreviation
                            value={data.civilStatus as string}
                            onValueChange={(value) => onDataChange({ ...data, civilStatus: value })}
                        />
                    </div>
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Social Profile</FieldLegend>
                <FieldDescription>Educational and cultural background.</FieldDescription>
                <FieldGroup>
                    <ComboboxField
                        description="Highest level of education completed"
                        label="Educational Attainment"
                        placeholder="Select level"
                        options={educationOptions}
                        icon={GraduationCap}
                        showAbbreviation
                        value={data.education as string}
                        onValueChange={(value) => onDataChange({ ...data, education: value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ComboboxField
                            label="Religion"
                            placeholder="Select religion"
                            options={religionOptions}
                            icon={Church}
                            showAbbreviation={false}
                            value={data.religion as string}
                            onValueChange={(value) => onDataChange({ ...data, religion: value })}
                        />
                        {data.religion === "other" && (
                            <InputField
                                id="specifyReligion"
                                label="Specify Religion *"
                                placeholder="Input religion"
                                value={(data.specifyReligion as string) || ""}
                                onChange={(e) => onDataChange({ ...data, specifyReligion: e.target.value })}
                                className="animate-in fade-in slide-in-from-top-2 duration-300"
                            />
                        )}
                    </div>

                    <FieldLabel htmlFor="isIndigenousPeople">

                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor="isIndigenousPeople">
                                    IP Member?
                                </FieldLabel>
                                <FieldDescription>
                                    Belongs to an Indigenous People&apos;s group/tribe.
                                </FieldDescription>
                            </FieldContent>
                            <Switch
                                id="isIndigenousPeople"
                                checked={!!data.isIndigenousPeople}
                                onCheckedChange={(checked) => onDataChange({ ...data, isIndigenousPeople: checked })}
                            />
                        </Field>
                    </FieldLabel>
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}
