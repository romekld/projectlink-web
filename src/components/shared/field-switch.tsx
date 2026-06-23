import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function FieldSwitch() {
    return (
        <FieldLabel htmlFor="switch-share">
            <Field orientation="horizontal">
                <FieldContent>
                    <FieldTitle>Member of 4Ps?</FieldTitle>
                    <FieldDescription>
                        Is the member a member of the Pantawid Pamilyang Pilipino Program (4Ps)?
                    </FieldDescription>
                </FieldContent>
                <Switch id="switch-share" />
            </Field>
        </FieldLabel >
    )
}
