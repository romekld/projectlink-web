"use client"

import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"

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
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

import { Church, GraduationCap, Sparkles, Hash, Fingerprint, CalendarDays } from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { relationshipOptions } from "../../options/relationship-options"
import { FieldDateOfBirth } from "../field-date-of-birth"
import { civilStatusOptions } from "../../options/civil-status-options"
import { educationOptions } from "../../options/education-options"
import { religionOptions } from "../../options/religion-options"
import { philhealthCategoryOptions } from "../../options/philhealth-category-options"
import { fpMethodOptions } from "../../options/fp-method-options"
import { fpStatusOptions } from "../../options/fp-status-options"
import { formatAge, autoSuggestClassification } from "../../options/classification"
import { useWizardStore } from "../../stores/wizard-store"

import type { MemberFormValues } from "../../schemas/household-form-schema"

interface MemberInfoFormProps {
  comboboxContainer?: HTMLElement | null
  onCancel?: () => void
}

const initialMedItems = [
  { value: "HPN", label: "Hypertension" },
  { value: "DM", label: "Diabetes" },
  { value: "TB", label: "Tuberculosis" },
  { value: "Asthma", label: "Asthma" },
]

export function MemberInfoForm({ comboboxContainer, onCancel }: MemberInfoFormProps) {
  const existingMembers = useWizardStore((s) => s.members)
  const hasHead = existingMembers.some((m) => m.relationship === "Head")

  const { control, watch } = useFormContext<MemberFormValues>()

  const anchor = useComboboxAnchor()

  const watchedSex = watch("sex")
  const watchedDateOfBirth = watch("dateOfBirth")
  const watchedIs4ps = watch("is4ps")
  const watchedIsPhilhealthMember = watch("isPhilhealthMember")
  const watchedUsingFP = watch("usingFP")
  const watchedFpMethods = watch("fpMethods")

  const classification = watchedDateOfBirth && watchedSex
    ? autoSuggestClassification(watchedDateOfBirth, watchedSex === "male" ? "M" : "F")
    : null
  const isWRA = classification === "WRA"

  const [medHistoryItems, setMedHistoryItems] = React.useState(initialMedItems)
  const [medInputValue, setMedInputValue] = React.useState("")
  const [lmpOpen, setLmpOpen] = React.useState(false)
  const [relationshipItems, setRelationshipItems] = React.useState(relationshipOptions)
  const [religionItems, setReligionItems] = React.useState(religionOptions)
  const fpMethodAnchor = useComboboxAnchor()

  const initialFpMethodItems = React.useMemo(() => fpMethodOptions, [])
  const [fpMethodItems, setFpMethodItems] = React.useState(initialFpMethodItems)
  const [fpMethodInputValue, setFpMethodInputValue] = React.useState("")

  const handleMedKeyDown = React.useCallback((e: React.KeyboardEvent, onChange: (val: string[]) => void, currentVal: string[]) => {
    if (e.key === "Enter") {
      const text = medInputValue.trim()
      if (!text) return
      const exists = medHistoryItems.some(
        (item) => item.label.toLowerCase() === text.toLowerCase(),
      )
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent?.stopImmediatePropagation()
      if (!exists) {
        const newItem = { value: text, label: text, code: "" }
        setMedHistoryItems((prev) => [...prev, newItem])
      }
      if (!currentVal.includes(text)) {
        onChange([...currentVal, text])
      }
      setMedInputValue("")
    }
  }, [medInputValue, medHistoryItems, setMedInputValue, setMedHistoryItems])

  const handleFpMethodKeyDown = React.useCallback((e: React.KeyboardEvent, onChange: (val: string[]) => void, currentVal: string[]) => {
    if (e.key === "Enter") {
      const text = fpMethodInputValue.trim()
      if (!text) return
      const exists = fpMethodItems.some(
        (item) => item.label.toLowerCase() === text.toLowerCase(),
      )
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent?.stopImmediatePropagation()
      if (!exists) {
        const newItem = { value: text, label: text, code: "" }
        setFpMethodItems((prev) => [...prev, newItem])
      }
      if (!currentVal.includes(text)) {
        onChange([...currentVal, text])
      }
      setFpMethodInputValue("")
    }
  }, [fpMethodInputValue, fpMethodItems, setFpMethodInputValue, setFpMethodItems])

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Member Profile</FieldLegend>
        <FieldDescription>Information about the member.</FieldDescription>
        <FieldGroup>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="member-last-name">Last Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...field}
                  id="member-last-name"
                  placeholder="e.g. Dela Cruz"
                  required
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="member-first-name">First Name <span className="text-destructive">*</span></FieldLabel>
                <Input
                  {...field}
                  id="member-first-name"
                  placeholder="e.g. Juan"
                  required
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="middleName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="member-middle-name">Middle Name <span className="text-muted-foreground">(Optional)</span></FieldLabel>
                <Input
                  {...field}
                  id="member-middle-name"
                  placeholder="e.g. Reyes"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="relationship"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Relationship to Head of Household <span className="text-destructive">*</span>
                </FieldLabel>
                  <Combobox
                    items={relationshipItems}
                    value={relationshipItems.find((o) => o.value === field.value) ?? null}
                    onValueChange={(val) => field.onChange(val?.value ?? "")}
                  >
                    <ComboboxInput
                      placeholder="Select or type custom..."
                      showClear
                      required
                      aria-invalid={fieldState.invalid}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const text = e.currentTarget.value.trim()
                          if (!text) return
                          const known = relationshipItems.some(
                            (o) => o.label === text || o.value === text,
                          )
                          if (!known) {
                            e.preventDefault()
                            e.stopPropagation()
                            e.nativeEvent?.stopImmediatePropagation()
                            const newItem = { value: text, label: text }
                            setRelationshipItems((prev) => [...prev, newItem])
                            field.onChange(text)
                            e.currentTarget.value = ""
                          } else {
                            e.preventDefault()
                            e.stopPropagation()
                            e.nativeEvent?.stopImmediatePropagation()
                          }
                        }
                      }}
                    />
                    <ComboboxContent container={comboboxContainer}>
                      <ComboboxEmpty>
                        {field.value
                          ? `Press Enter to add &ldquo;${field.value}&rdquo;`
                          : "Press Enter to add custom relationship"}
                      </ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item.value}
                            value={item}
                            disabled={item.value === "Head" && hasHead}
                          >
                            <Badge variant="outline">{item.code}</Badge>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                <FieldDescription>
                  {hasHead && field.value !== "Head"
                    ? "Head already assigned. Only one head per household."
                    : "Select the relationship of the member to the household head, or type a custom one and press Enter."}
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Demographics</FieldLegend>
        <FieldDescription>Information about the member.</FieldDescription>
        <FieldGroup>
          <FieldSet>
            <FieldLegend variant="label">Sex <span className="text-destructive">*</span></FieldLegend>
            <Controller
              name="sex"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-4"
                    required
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="member-sex-female">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Female</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="female" id="member-sex-female" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="member-sex-male">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Male</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="male" id="member-sex-male" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldSet>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldDateOfBirth value={field.value} onValueChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>
                Age <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-end">
                  <Sparkles />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Auto-computed"
                  required
                  readOnly
                  value={watchedDateOfBirth ? formatAge(watchedDateOfBirth) : ""}
                />
              </InputGroup>
              <FieldDescription>Automatically computed from date of birth.</FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel>
              Classification by Age/Health Risk Group <span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-end">
                <Sparkles />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Auto-computed"
                required
                readOnly
                value={classification ?? "—"}
              />
            </InputGroup>
            <FieldDescription>
              Automatically classified based on age and sex (e.g. Infant, Child, Adult, Senior, WRA).
            </FieldDescription>
          </Field>

          <Controller
            name="civilStatus"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Civil Status <span className="text-destructive">*</span>
                </FieldLabel>
                <Combobox
                  items={civilStatusOptions}
                  value={field.value ? civilStatusOptions.find((o) => o.value === field.value) ?? null : null}
                  onValueChange={(val) => field.onChange(val?.value ?? "")}
                >
                  <ComboboxInput placeholder="Select a civil status" showClear required aria-invalid={fieldState.invalid} />
                  <ComboboxContent container={comboboxContainer}>
                    <ComboboxEmpty>No civil statuses found.</ComboboxEmpty>
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
                  Select the civil status of the member.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="education"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Educational Attainment
                </FieldLabel>
                <Combobox
                  items={educationOptions}
                  value={field.value ? educationOptions.find((o) => o.label === field.value) ?? null : null}
                  onValueChange={(val) => field.onChange(val?.label ?? "")}
                >
                  <ComboboxInput placeholder="Select educational attainment" showClear aria-invalid={fieldState.invalid}>
                    <InputGroupAddon>
                      <GraduationCap />
                    </InputGroupAddon>
                  </ComboboxInput>
                  <ComboboxContent container={comboboxContainer}>
                    <ComboboxEmpty>No educational attainments found.</ComboboxEmpty>
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
                  Select the educational attainment of the member.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="religion"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Religion
                </FieldLabel>
                <Combobox
                  items={religionItems}
                  value={religionItems.find((o) => o.label === field.value) ?? null}
                  onValueChange={(val) => field.onChange(val?.label ?? "")}
                >
                  <ComboboxInput
                    placeholder="Select or type custom..."
                    showClear
                    aria-invalid={fieldState.invalid}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const text = e.currentTarget.value.trim()
                        if (!text) return
                        const known = religionItems.some(
                          (o) => o.label === text || o.value === text,
                        )
                        if (!known) {
                          e.preventDefault()
                          e.stopPropagation()
                          e.nativeEvent?.stopImmediatePropagation()
                          const newItem = { value: text, label: text }
                          setReligionItems((prev) => [...prev, newItem])
                          field.onChange(text)
                          e.currentTarget.value = ""
                        } else {
                          e.preventDefault()
                          e.stopPropagation()
                          e.nativeEvent?.stopImmediatePropagation()
                        }
                      }
                    }}
                  >
                    <InputGroupAddon>
                      <Church />
                    </InputGroupAddon>
                  </ComboboxInput>
                  <ComboboxContent container={comboboxContainer}>
                    <ComboboxEmpty>
                      {field.value
                        ? `Press Enter to add &ldquo;${field.value}&rdquo;`
                        : "Press Enter to add custom religion"}
                    </ComboboxEmpty>
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
                  Select the religious affiliation of the member, or type a custom one and press Enter.
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
                        Is the member a member of the Pantawid Pamilyang Pilipino Program (4Ps)?
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

          {watchedIs4ps && (
            <Controller
              name="is4psId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="member-4ps-id">4Ps ID Number<span className="text-destructive">*</span></FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Hash />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="member-4ps-id"
                      placeholder="e.g. 1234-5678-9012"
                      required
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
                  <FieldDescription>Enter the 4Ps household ID number if the member is a 4Ps beneficiary.</FieldDescription>
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
                        Is the member a member of Indigenous Peoples?
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

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Philhealth Information</FieldLegend>
        <FieldDescription>Philhealth membership details of the member.</FieldDescription>
        <FieldGroup>
          <Controller
            name="isPhilhealthMember"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="switch-philhealth">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Member of Philhealth?</FieldTitle>
                      <FieldDescription>
                        Is the member a member of Philhealth?
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id="switch-philhealth"
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

          {watchedIsPhilhealthMember && (
            <>
              <Controller
                name="philhealthId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="philhealth-id">
                      Philhealth ID Number
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Fingerprint />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="philhealth-id"
                        placeholder="e.g. 12-123456789-0"
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <FieldSet>
                <FieldLegend variant="label">Membership Type</FieldLegend>
                <Controller
                  name="philhealthMembershipType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        required
                        aria-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="philhealth-member">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Member</FieldTitle>
                              <FieldDescription>
                                Primary person registered and actively paying.
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="M" id="philhealth-member" />
                          </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="philhealth-dependent">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>Dependent</FieldTitle>
                              <FieldDescription>
                                Registered as a dependent of a member, not paying but still covered.
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="D" id="philhealth-dependent" />
                          </Field>
                        </FieldLabel>
                      </RadioGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldSet>

              <Controller
                name="philhealthCategory"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Philhealth Category <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Combobox
                      items={philhealthCategoryOptions}
                      value={field.value ? philhealthCategoryOptions.find((o) => o.label === field.value) ?? null : null}
                      onValueChange={(val) => field.onChange(val?.label ?? "")}
                    >
                      <ComboboxInput placeholder="Select a category" showClear required aria-invalid={fieldState.invalid} />
                      <ComboboxContent container={comboboxContainer}>
                        <ComboboxEmpty>No categories found.</ComboboxEmpty>
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
                      Select the PhilHealth membership category of the member.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Medical History</FieldLegend>
        <FieldDescription>Known medical conditions of the member.</FieldDescription>
        <FieldGroup>
          <Controller
            name="medicalHistory"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Medical History
                </FieldLabel>
                <Combobox
                  multiple
                  autoHighlight
                  items={medHistoryItems}
                  value={medHistoryItems.filter((item) => field.value.includes(item.value))}
                  onValueChange={(val) => field.onChange((val ?? []).map((v: { value: string }) => v.value))}
                >
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: { label: string; value: string }) => (
                            <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput
                            placeholder="Type or select a condition, press Enter to add"
                            value={medInputValue}
                            onChange={(e) => setMedInputValue(e.target.value)}
                            onKeyDown={(e) => handleMedKeyDown(e, field.onChange, field.value)}
                          />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor} container={comboboxContainer}>
                    <ComboboxEmpty>
                      {medInputValue.trim()
                        ? `Press Enter to add "${medInputValue.trim()}"`
                        : "No medical histories found."}
                    </ComboboxEmpty>
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
                  Select from the list or type a custom medical condition and press Enter to add.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      {isWRA && (
        <>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Maternal Health / Family Planning</FieldLegend>
            <FieldDescription>Reproductive health and family planning information.</FieldDescription>
            <FieldGroup>
              <Controller
                name="lmpDate"
                control={control}
                render={({ field, fieldState }) => {
                  const lmpDate = field.value ? new Date(field.value) : undefined
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lmp-date">
                        Last Menstrual Period (LMP)
                      </FieldLabel>
                      <Popover open={lmpOpen} onOpenChange={setLmpOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="lmp-date"
                            variant="outline"
                            className="justify-start font-normal"
                          >
                            <CalendarDays />
                            {lmpDate
                              ? lmpDate.toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Select LMP date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={lmpDate}
                            defaultMonth={lmpDate}
                            captionLayout="dropdown"
                            disabled={{ after: new Date() }}
                            onSelect={(date) => {
                              field.onChange(date?.toISOString() ?? "")
                              setLmpOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FieldDescription>
                        If pregnant, enter the first day of the last menstrual period.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )
                }}
              />

              <Controller
                name="usingFP"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="using-fp">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Using any FP Method?</FieldTitle>
                          <FieldDescription>
                            Is the member currently using any family planning method?
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id="using-fp"
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

              {watchedUsingFP && (
                <Controller
                  name="fpMethods"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Family Planning Method(s) <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Combobox
                        multiple
                        autoHighlight
                        items={fpMethodItems}
                        value={fpMethodItems.filter((item) => field.value.includes(item.value))}
                        onValueChange={(val) => field.onChange((val ?? []).map((v: { value: string }) => v.value))}
                      >
                        <ComboboxChips ref={fpMethodAnchor}>
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((value: { label: string; value: string; code: string }) => (
                                <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput
                                  placeholder="Type or select FP method"
                                  value={fpMethodInputValue}
                                  onChange={(e) => setFpMethodInputValue(e.target.value)}
                                  onKeyDown={(e) => handleFpMethodKeyDown(e, field.onChange, field.value)}
                                />
                              </>
                            )}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={fpMethodAnchor} container={comboboxContainer}>
                          <ComboboxEmpty>
                            {fpMethodInputValue.trim()
                              ? `Press Enter to add "${fpMethodInputValue.trim()}"`
                              : "No methods found."}
                          </ComboboxEmpty>
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
                        Select from the list or type a custom method and press Enter to add.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {watchedUsingFP && watchedFpMethods.length > 0 && (
                <Controller
                  name="fpStatus"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        FP Status <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Combobox
                        items={fpStatusOptions}
                        value={field.value ? fpStatusOptions.find((o) => o.value === field.value) ?? null : null}
                        onValueChange={(val) => field.onChange(val?.value ?? "")}
                      >
                        <ComboboxInput placeholder="Select FP status" showClear aria-invalid={fieldState.invalid} />
                        <ComboboxContent container={comboboxContainer}>
                          <ComboboxEmpty>No statuses found.</ComboboxEmpty>
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
                        Select the current family planning status of the member.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </FieldSet>
        </>
      )}

      {onCancel && (
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="lg" className="flex-1">
            Save Member
          </Button>
        </div>
      )}
    </FieldGroup>
  )
}
