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

export function FieldCheckbox() {
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>Ethnicity</FieldLegend>
                <FieldDescription>
                    Select the items you want to show on the desktop.
                </FieldDescription>
                <FieldGroup className="gap-3">
                    <Field orientation="horizontal">
                        <Checkbox id="ip" />
                        <FieldContent>
                            <FieldLabel htmlFor="ip">
                                Indigenous People?
                            </FieldLabel>
                            <FieldDescription>
                                Check if you identify as a member of an indigenous cultural community.
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                        <Checkbox id="4ps" />
                        <FieldLabel
                            htmlFor="4ps"
                            className="font-normal"
                        >
                            4Ps Member?
                        </FieldLabel>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    )
}
