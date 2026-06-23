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
    FieldError,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "../../date-picker"
import { SelectField } from "../../../../../../../components/shared-1/field-select"
import {
    medicalHistoryOptions,
    fpMethodOptions,
    fpStatusOptions,
} from "../../../data"
import { autoSuggestClassification, classificationOptions } from "../../../data/classification"
import type { WizardStepProps } from "../wizard"

import { InputField } from "../../../../../../../components/shared-1/field-input"

export function ClinicalReproductiveStep({ data, onDataChange, errors = {} }: WizardStepProps) {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
        const currentHistory = (data.medicalHistory as string[]) || []
        if (checked) {
            onDataChange({ ...data, medicalHistory: [...currentHistory, optionValue] })
        } else {
            onDataChange({ ...data, medicalHistory: currentHistory.filter((v: string) => v !== optionValue) })
        }
    }

    const showOtherMedical = ((data.medicalHistory as string[]) || []).includes("other")

    const classification = React.useMemo(() => {
        if (!data.birthdate || !data.sex) return ""
        return autoSuggestClassification(data.birthdate as string, data.sex as "M" | "F") || ""
    }, [data.birthdate, data.sex])

    const classificationDisplay = React.useMemo(() => {
        if (!classification) return ""
        const option = classificationOptions.find(opt => opt.code === classification)
        return option ? option.label : classification
    }, [classification])

    const isWRA = classification === "WRA"
    const isFemale = data.sex === "F"
    const isPregnant = classification === "P" || classification === "AP"
    const showReproductive = (isWRA || isPregnant) && isFemale

    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Health History</FieldLegend>
                <FieldDescription>Known medical conditions and clinical history.</FieldDescription>
                <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {medicalHistoryOptions.map((option) => (
                            <Field key={option.value} orientation="horizontal" className="flex items-center gap-3">
                                <Checkbox
                                    id={option.value}
                                    checked={((data.medicalHistory as string[]) || []).includes(option.value)}
                                    onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                                />
                                <FieldLabel htmlFor={option.value} className="">

                                    <div className="grid grid-cols-[max-content_1fr] !gap-2 font-normal cursor-pointer">
                                        <div className="text-muted-foreground">{option.code}</div>
                                        <div className="">{option.label}</div>
                                    </div>
                                </FieldLabel>
                            </Field>
                        ))}
                    </div>

                    {showOtherMedical && (
                        <InputField
                            id="medicalOther"
                            label="Specify Other Condition *"
                            placeholder="e.g. Hypertension"
                            value={(data.medicalOther as string) || ""}
                            onChange={(e) => onDataChange({ ...data, medicalOther: e.target.value })}
                            className="animate-in fade-in slide-in-from-top-2 duration-300"
                            error={errors.medicalOther}
                        />
                    )}
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>System Classification</FieldLegend>
                <FieldDescription>Automatic health risk group based on age and sex.</FieldDescription>
                <FieldGroup>
                    <InputField
                        id="classification"
                        label="Risk Group Classification"
                        placeholder="Pending calculation..."
                        readOnly
                        value={classificationDisplay}
                        description="This value is system-generated and cannot be edited."
                        error={errors.classification}
                    />
                </FieldGroup>
            </FieldSet>

            {showReproductive && (
                <>
                    <FieldSeparator />
                    <FieldSet className="animate-in fade-in duration-500">
                        <FieldLegend>Reproductive Health & FP</FieldLegend>
                        <FieldDescription>Health data for Women of Reproductive Age.</FieldDescription>
                        <FieldGroup>
                            {isPregnant && (
                                <Field className="animate-in fade-in slide-in-from-top-2 duration-300" data-invalid={!!errors.lmp}>
                                    <FieldLabel htmlFor="lmp">Last Menstrual Period (LMP) *</FieldLabel>
                                    <DatePicker
                                        date={data.lmp ? new Date(data.lmp as string) : undefined}
                                        onDateChange={(date) => onDataChange({ ...data, lmp: date ? date.toISOString().split('T')[0] : '' })}
                                        aria-invalid={!!errors.lmp}
                                    />
                                    <FieldError>{errors.lmp}</FieldError>
                                    <FieldDescription>Required for pregnant members.</FieldDescription>
                                </Field>
                            )}

                            <FieldLabel htmlFor="usingFp">

                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor="usingFp">
                                            Using FP Method?
                                        </FieldLabel>
                                        <FieldDescription>
                                            Current family planning usage.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="usingFp"
                                        checked={!!data.usingFp}
                                        onCheckedChange={(checked) => onDataChange({ ...data, usingFp: checked })}
                                    />
                                </Field>
                            </FieldLabel>
{!!data.usingFp && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <SelectField
            label="FP Method *"
            placeholder="Select method"
            options={fpMethodOptions}
            value={data.fpMethod as string}
            onValueChange={(value) => onDataChange({ ...data, fpMethod: value })}
            error={errors.fpMethod}
        />
        <SelectField
            label="FP Status *"
            placeholder="Select status"
            options={fpStatusOptions}
            showAbbreviation
            value={data.fpStatus as string}
            onValueChange={(value) => onDataChange({ ...data, fpStatus: value })}
            error={errors.fpStatus}
        />
        {data.fpMethod === "other" && (
            <InputField
                id="fpMethodOther"
                label="Specify FP Method *"
                placeholder="Input method"
                value={(data.fpMethodOther as string) || ""}
                onChange={(e) => onDataChange({ ...data, fpMethodOther: e.target.value })}
                className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300"
                error={errors.fpMethodOther}
            />
        )}
    </div>
)}
                        </FieldGroup>
                    </FieldSet>
                </>
            )}
        </FieldGroup>
    )
}
