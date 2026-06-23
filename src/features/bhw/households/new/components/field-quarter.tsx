import { Lock } from "lucide-react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export function FieldQuarter() {
  return (
    <Field>
      <FieldLabel htmlFor="input-group-url">Quarter</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-url" placeholder="Quarter" defaultValue="First" readOnly />
        <InputGroupAddon align="inline-end">
          <Lock />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
