"use client"

import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { householdInfoSchema, type HouseholdInfoValues } from "../data/form-schema"
import { BarangayCombobox } from "@/features/bhw/households/components/barangay-combobox"
import { HouseholdLocationDialog } from "@/features/bhw/households/components/household-location-dialog"
import type { BarangayOption } from "@/features/bhw/households/components/barangay-combobox"

type StepHouseholdInfoProps = {
  formId: string
  defaultValues?: Partial<HouseholdInfoValues>
  quarterLabel: string
  barangays: BarangayOption[]
  onNext: (values: HouseholdInfoValues) => void
}

export function StepHouseholdInfo({
  formId,
  defaultValues,
  quarterLabel,
  barangays,
  onNext,
}: StepHouseholdInfoProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HouseholdInfoValues>({
    resolver: zodResolver(householdInfoSchema),
    defaultValues: {
      nhtsStatus: "Non-NHTS",
      isIndigenousPeople: false,
      hhHeadPhilhealthMember: false,
      ...defaultValues,
    },
  })

  const philhealthMember = useWatch({ control, name: "hhHeadPhilhealthMember" })
  const watchedBarangayId = useWatch({ control, name: "barangayId" })
  const watchedLat = useWatch({ control, name: "latitude" })
  const watchedLng = useWatch({ control, name: "longitude" })

  const currentPin =
    watchedLat != null && watchedLng != null
      ? { lat: watchedLat, lng: watchedLng }
      : null

  return (
    <form id={formId} onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Visit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.visitDate}>
              <FieldLabel htmlFor="visitDate">Date of Visit — {quarterLabel}</FieldLabel>
              <Controller
                name="visitDate"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="visitDate"
                          type="button"
                          variant="outline"
                          className="flex-1 justify-between font-normal"
                          aria-invalid={!!errors.visitDate}
                        >
                          {field.value
                            ? format(new Date(field.value), "MMMM d, yyyy")
                            : "Select visit date"}
                          <CalendarIcon data-icon="inline-end" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (!date) return
                            field.onChange(format(date, "yyyy-MM-dd"))
                            setDatePickerOpen(false)
                          }}
                          disabled={{ after: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className=""
                      onClick={() => {
                        field.onChange(format(new Date(), "yyyy-MM-dd"))
                        setDatePickerOpen(false)
                      }}
                    >
                      Today
                    </Button>
                  </div>
                )}
              />
              <FieldError errors={[errors.visitDate]} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Respondent</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.respondentLastName}>
                <FieldLabel htmlFor="respondentLastName">Last name</FieldLabel>
                <Input
                  id="respondentLastName"
                  placeholder="Dela Cruz"
                  aria-invalid={!!errors.respondentLastName}
                  {...register("respondentLastName")}
                />
                <FieldError errors={[errors.respondentLastName]} />
              </Field>

              <Field data-invalid={!!errors.respondentFirstName}>
                <FieldLabel htmlFor="respondentFirstName">First name</FieldLabel>
                <Input
                  id="respondentFirstName"
                  placeholder="Juan"
                  aria-invalid={!!errors.respondentFirstName}
                  {...register("respondentFirstName")}
                />
                <FieldError errors={[errors.respondentFirstName]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="respondentMiddleName">Middle name</FieldLabel>
              <Input
                id="respondentMiddleName"
                placeholder="Optional"
                {...register("respondentMiddleName")}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Household Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.nhtsStatus}>
              <FieldLabel htmlFor="nhtsStatus">NHTS Household</FieldLabel>
              <Controller
                name="nhtsStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="nhtsStatus" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="NHTS-4Ps">NHTS-4Ps</SelectItem>
                        <SelectItem value="Non-NHTS">Non-NHTS</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>Is this household a 4Ps beneficiary?</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="isIndigenousPeople">Indigenous People (IP) Household</FieldLabel>
              <Controller
                name="isIndigenousPeople"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isIndigenousPeople"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Yes, IP household" : "Not an IP household"}
                    </span>
                  </div>
                )}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="houseNoStreet">House No. &amp; Street</FieldLabel>
            <Input
              id="houseNoStreet"
              placeholder="e.g. 123 Rizal St."
              {...register("houseNoStreet")}
            />
            <FieldError>{errors.houseNoStreet?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="purok">
              Purok{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="purok"
              placeholder="e.g. Purok 3"
              {...register("purok")}
            />
          </Field>

          <Field data-invalid={!!errors.barangayId}>
            <FieldLabel>Barangay</FieldLabel>
            <Controller
              control={control}
              name="barangayId"
              render={({ field }) => (
                <BarangayCombobox
                  barangays={barangays}
                  value={field.value ?? null}
                  onSelect={(id, name) => {
                    field.onChange(id)
                    setValue("barangayName", name)
                  }}
                />
              )}
            />
            <FieldError>{errors.barangayId?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="municipality">Municipality</FieldLabel>
              <Input id="municipality" value="Dasmariñas" disabled readOnly />
            </Field>
            <Field>
              <FieldLabel htmlFor="province">Province</FieldLabel>
              <Input id="province" value="Cavite" disabled readOnly />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>PhilHealth — HH Head</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="hhHeadPhilhealthMember">HH Head is a PhilHealth member</FieldLabel>
              <Controller
                name="hhHeadPhilhealthMember"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      id="hhHeadPhilhealthMember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Yes, PhilHealth member" : "No PhilHealth membership"}
                    </span>
                  </div>
                )}
              />
            </Field>

            {philhealthMember && (
              <>
                <Field>
                  <FieldLabel htmlFor="hhHeadPhilhealthId">PhilHealth ID No.</FieldLabel>
                  <Input
                    id="hhHeadPhilhealthId"
                    placeholder="XX-XXXXXXXXX-X"
                    {...register("hhHeadPhilhealthId")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="hhHeadPhilhealthCategory">PhilHealth Category</FieldLabel>
                  <Controller
                    name="hhHeadPhilhealthCategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger id="hhHeadPhilhealthCategory" className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[
                              "Formal Economy",
                              "Informal Economy",
                              "Indigent/Sponsored",
                              "Senior Citizen",
                              "Other",
                            ].map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Household Location */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            Household Location
            <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HouseholdLocationDialog
            barangayId={watchedBarangayId ?? null}
            currentPin={currentPin}
            onConfirm={(pin) => {
              setValue("latitude", pin?.lat ?? null)
              setValue("longitude", pin?.lng ?? null)
            }}
          />
        </CardContent>
      </Card>
    </form>
  )
}
