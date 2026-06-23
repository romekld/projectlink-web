import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FieldRadio() {
  return (
    <FieldSet>
      <FieldLegend variant="label">Gender</FieldLegend>
      {/* <FieldDescription>Sample demo of radio group.</FieldDescription> */}
      <RadioGroup defaultValue="plus" className="grid grid-cols-2 gap-4">
        <FieldLabel htmlFor="plus-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Female</FieldTitle>
            </FieldContent>
            <RadioGroupItem value="plus" id="plus-plan" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="pro-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Male</FieldTitle>
            </FieldContent>
            <RadioGroupItem value="pro" id="pro-plan" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>

  )
}
