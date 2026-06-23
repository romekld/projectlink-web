"use client"

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

export function FieldCheckbox() {
    return (
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
                />
            </Field>
        </FieldLabel>
    )
}
