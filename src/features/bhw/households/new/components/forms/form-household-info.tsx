"use client"

import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Droplets, House, Signpost, Toilet, MapPin, Minus, Plus, Hash, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"

import { FieldDate } from "../field-date"
import { waterSourceOptions } from "../../options/water-source-options"
import { toiletFacilityOptions } from "../../options/toilet-facility-options"
import { Switch } from "@/components/ui/switch"
import { FieldError } from "@/components/ui/field"

import type { HouseholdFormValues } from "../../schemas/household-form-schema"
import type { CoverageBarangay } from "../../services/map-service"

interface HouseholdInfoFormProps {
  coverageBarangays: CoverageBarangay[]
}

export function HouseholdInfoForm({ coverageBarangays }: HouseholdInfoFormProps) {
  const { control, setValue, getValues } = useFormContext<HouseholdFormValues>()
  const primaryBarangay = coverageBarangays.find((b) => b.isPrimary) ?? coverageBarangays[0]

  const barangayItems = coverageBarangays.map((b) => ({
    value: b.cityBarangayId,
    label: b.name,
  }))

  useEffect(() => {
    const current = getValues("barangay")
    if (!current && primaryBarangay) {
      setValue("barangay", primaryBarangay.cityBarangayId, { shouldValidate: false })
    }
  }, [getValues, setValue, primaryBarangay])
  const is4psValue = useWatch({ control, name: "is4ps" })

  return (
    <>
      <FieldSet>
        <FieldLegend>Visit Log</FieldLegend>
        <FieldDescription>Record the date of the household visit.</FieldDescription>
        <FieldGroup>
          <Controller
            name="visitDate"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldDate value={field.value} onValueChange={field.onChange} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Household Address</FieldLegend>
        <FieldDescription>Location of the household.</FieldDescription>
        <FieldGroup>
          <Controller
            name="barangay"
            control={control}
            render={({ field, fieldState }) => {
              const selected = barangayItems.find((b) => b.value === field.value) ?? null
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Barangay <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Combobox
                    items={barangayItems}
                    value={selected ?? barangayItems.find((b) => b.value === primaryBarangay?.cityBarangayId) ?? null}
                    onValueChange={(val) => field.onChange(val?.value ?? "")}
                  >
                    <ComboboxInput placeholder="Select a barangay" showClear required aria-invalid={fieldState.invalid}>
                      <InputGroupAddon>
                        <MapPin />
                      </InputGroupAddon>
                    </ComboboxInput>
                    <ComboboxContent>
                      <ComboboxEmpty>No barangays found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldDescription>
                    Select the barangay where the household is located.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )
            }}
          />

          <Controller
            name="addressLine1"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="hh-address-line1">Address Line 1 <span className="text-destructive">*</span></FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <House />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="hh-address-line1"
                    placeholder="e.g. Blk 123 Lot 44"
                    required
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="addressLine2"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="hh-address-line2">Address Line 2</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Signpost />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="hh-address-line2"
                    placeholder="e.g. Purok 1"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                <FieldDescription>Additional address details such as purok or subdivision.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Respondent Profile</FieldLegend>
        <FieldDescription>Information about the person providing the household information.</FieldDescription>
        <FieldGroup>
          <Controller
            name="respondentLastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="respondent-last-name">Last Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...field}
                  id="respondent-last-name"
                  placeholder="e.g. Dela Cruz"
                  required
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="respondentFirstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="respondent-first-name">First Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...field}
                  id="respondent-first-name"
                  placeholder="e.g. Juan"
                  required
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="respondentMiddleName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="respondent-middle-name">Middle Name <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                <Input
                  {...field}
                  id="respondent-middle-name"
                  placeholder="e.g. Reyes"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Household Information</FieldLegend>
        <FieldDescription>Facilities and resources available to the household.</FieldDescription>
        <FieldGroup>
          <Controller
            name="familyCount"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="no-of-families">Number of Families <span className="text-destructive">*</span></FieldLabel>
                <ButtonGroup>
                  <InputGroup>
                    <InputGroupAddon>
                      <UsersRound />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      id="no-of-families"
                      value={field.value}
                      min="1"
                      placeholder="e.g. 3"
                      required
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </InputGroup>
                  <Button variant="outline" onClick={() => field.onChange(Math.max(1, field.value - 1))}><Minus /></Button>
                  <Button variant="outline" onClick={() => field.onChange(field.value + 1)}><Plus /></Button>
                </ButtonGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="waterSource"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Type of Water Source <span className="text-destructive">*</span>
                </FieldLabel>
                <Combobox
                  items={waterSourceOptions}
                  value={field.value ? waterSourceOptions.find((o) => o.value === field.value) ?? null : null}
                  onValueChange={(val) => field.onChange(val?.value ?? "")}
                >
                  <ComboboxInput placeholder="Select a water source" showClear required aria-invalid={fieldState.invalid}>
                    <InputGroupAddon>
                      <Droplets />
                    </InputGroupAddon>
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxEmpty>No options found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          <Badge variant="outline">{item.code}</Badge>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>
                  Select the primary source of drinking water for the household.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="toiletFacility"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Type of Toilet Facility <span className="text-destructive">*</span>
                </FieldLabel>
                <Combobox
                  items={toiletFacilityOptions}
                  value={field.value ? (() => {
                    for (const group of toiletFacilityOptions) {
                      const found = group.items.find((o) => o.value === field.value)
                      if (found) return found
                    }
                    return null
                  })() : null}
                  onValueChange={(val) => field.onChange(val?.value ?? "")}
                >
                  <ComboboxInput placeholder="Select a toilet facility" showClear required aria-invalid={fieldState.invalid}>
                    <InputGroupAddon>
                      <Toilet />
                    </InputGroupAddon>
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxEmpty>No options found.</ComboboxEmpty>
                    <ComboboxList>
                      {(group, index) => (
                        <ComboboxGroup key={group.label} items={group.items}>
                          <ComboboxLabel>{group.label}</ComboboxLabel>
                          <ComboboxCollection>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                <Badge variant="outline">{item.code}</Badge>
                                {item.label}
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                          {index < toiletFacilityOptions.length - 1 && <ComboboxSeparator />}
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>
                  Select the type of toilet facility available to the household.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="is4ps"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="switch-4ps">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Member of 4Ps?</FieldTitle>
                      <FieldDescription>
                        Is the household a member of the Pantawid Pamilyang Pilipino Program (4Ps)?
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="switch-4ps"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {is4psValue && (
            <Controller
              name="is4psId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hh-4ps-id">4Ps ID Number <span className="text-destructive">*</span></FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Hash />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="hh-4ps-id"
                      placeholder="e.g. 1234-5678-9012"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the 4Ps household ID number if the household is a 4Ps beneficiary.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          <Controller
            name="isIndigenous"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="switch-ip">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Indigenous People?</FieldTitle>
                      <FieldDescription>
                        Does the household belong to Indigenous Peoples?
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="switch-ip"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </>
  )
}
