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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SelectField } from "../../select-field"
import {
    philhealthCategoryOptions,
    membershipTypeOptions,
} from "../../../data"
import type { WizardStepProps } from "../wizard"

import { InputField } from "../../input-field"

export function SocioEconomicStep({ data, onDataChange }: WizardStepProps) {
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Socio-Economic Status</FieldLegend>
                <FieldDescription>National Household Targeting System and 4Ps membership.</FieldDescription>
                <FieldGroup>
                    <FieldLabel htmlFor="is4Ps">

                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldLabel htmlFor="is4Ps">
                                    4Ps Member?
                                </FieldLabel>
                                <FieldDescription>
                                    Member of Pantawid Pamilyang Pilipino Program?
                                </FieldDescription>
                            </FieldContent>
                            <Switch
                                id="is4Ps"
                                checked={data.nhtsStatus === "NHTS-4Ps"}
                                onCheckedChange={(checked) => onDataChange({
                                    ...data,
                                    nhtsStatus: checked ? "NHTS-4Ps" : "Non-NHTS"
                                })}
                            />
                        </Field>
                    </FieldLabel>
                    {data.nhtsStatus === "NHTS-4Ps" && (
                        <InputField
                            id="nhtsId"
                            label="4Ps Household ID *"
                            placeholder="Enter ID number"
                            value={(data.nhtsId as string) || ""}
                            onChange={(e) => onDataChange({ ...data, nhtsId: e.target.value })}
                            description="The unique identification number for the 4Ps household."
                            className="animate-in fade-in slide-in-from-top-2 duration-300"
                        />
                    )}
                </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
                <FieldLegend>Health Coverage</FieldLegend>
                <FieldDescription>Details regarding PhilHealth insurance membership.</FieldDescription>
                <FieldGroup>
                    <InputField
                        id="philhealthId"
                        label="Philhealth ID Number"
                        placeholder="00-000000000-0"
                        value={(data.philhealthId as string) || ""}
                        onChange={(e) => onDataChange({ ...data, philhealthId: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                            label="Membership Type"
                            placeholder="Select type"
                            options={membershipTypeOptions}
                            showAbbreviation
                            value={data.membershipType as string}
                            onValueChange={(value) => onDataChange({ ...data, membershipType: value })}
                        />
                        <SelectField
                            label="Philhealth Category"
                            placeholder="Select category"
                            options={philhealthCategoryOptions}
                            value={data.philhealthCategory as string}
                            onValueChange={(value) => onDataChange({ ...data, philhealthCategory: value })}
                        />
                    </div>
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}
