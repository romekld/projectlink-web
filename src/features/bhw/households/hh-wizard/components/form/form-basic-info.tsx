"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ButtonGroup,
} from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { DatePicker } from "../date-picker"
import { Hash, House, Signpost, MapPin, Toilet, Droplet } from "lucide-react"
import { useHouseholdWizard } from "@/lib/store/household-wizard"
import { step1Schema, Step1Values } from "../../data/form-schema"
import { barangayData } from "@/features/admin/users/data/barangays"
import { ComboboxField } from "../combobox-field"
import { SelectField } from "../select-field"
import { NumberField } from "../number-field"

import {
  toiletFacilityOptions, waterSourceOptions
} from "../../data"

const barangayOptions = barangayData.map((b) => ({
  value: b.name,
  label: b.name,
}))

import { InputField } from "../input-field"

export function BasicInfoForm() {
  const { householdData, setHouseholdData, validationErrors, setValidationError } = useHouseholdWizard()

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      visitDate: householdData.visitDate || "",
      barangay: householdData.barangay || "",
      respondentLastName: householdData.respondentLastName || "",
      respondentFirstName: householdData.respondentFirstName || "",
      waterSource: householdData.waterSource || "",
      toiletFacility: householdData.toiletFacility || "",
      houseNoStreet: householdData.houseNoStreet || "",
      purok: householdData.purok || "",
      numberOfFamilies: householdData.numberOfFamilies || 1,
    },
  })

  // Initialize form with store data
  useEffect(() => {
    if (householdData.visitDate) setValue("visitDate", householdData.visitDate)
    if (householdData.barangay) setValue("barangay", householdData.barangay)
    if (householdData.respondentLastName) setValue("respondentLastName", householdData.respondentLastName)
    if (householdData.respondentFirstName) setValue("respondentFirstName", householdData.respondentFirstName)
    if (householdData.waterSource) setValue("waterSource", householdData.waterSource)
    if (householdData.toiletFacility) setValue("toiletFacility", householdData.toiletFacility)
    if (householdData.houseNoStreet) setValue("houseNoStreet", householdData.houseNoStreet)
    if (householdData.purok) setValue("purok", householdData.purok)
    if (householdData.numberOfFamilies) setValue("numberOfFamilies", householdData.numberOfFamilies)
  }, [householdData, setValue])

  const onSubmit = (data: Step1Values) => {
    setHouseholdData(data)
  }

  const handleFieldChange = (field: keyof HouseholdData | keyof Step1Values, value: any) => {
    setHouseholdData({ [field]: value })
    // Clear error for this field when changed
    if (validationErrors[field as string]) {
      setValidationError(field as string, "")
    }
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Basic Information</h1>
            <p className="text-sm text-muted-foreground">
              Please provide the basic information of the household.
            </p>
          </div>

          <FieldSet>
            <FieldLegend>Visit Information</FieldLegend>
            <FieldDescription>for tracking the progress of the profiling project.</FieldDescription>
            <FieldGroup>
              <Field data-invalid={!!validationErrors.visitDate}>
                <FieldLabel htmlFor="visitDate">Date of Visit *</FieldLabel>
                <DatePicker
                  date={householdData.visitDate ? new Date(householdData.visitDate) : undefined}
                  onDateChange={(date: Date | undefined) => {
                    if (date) {
                      const dateString = date.toISOString().split('T')[0]
                      handleFieldChange("visitDate", dateString)
                    }
                  }}
                  aria-invalid={!!validationErrors.visitDate}
                />
                <FieldError>{validationErrors.visitDate}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="quarter">Quarter</FieldLabel>
                <ButtonGroup>
                  {["First", "Second", "Third", "Fourth"].map((q) => (
                    <Button
                      key={q}
                      variant={householdData.quarter === q ? "default" : "outline"}
                      type="button"
                      className="flex-1"
                      onClick={() => handleFieldChange("quarter", q)}
                    >
                      {q}
                    </Button>
                  ))}
                </ButtonGroup>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Address</FieldLegend>
            <FieldDescription>Location details for the household.</FieldDescription>
            <FieldGroup>
              <InputField
                id="householdNo"
                label="Household No."
                value="202606-PHS203-00001"
                readOnly
                icon={Hash}
                description="Auto-generated, read-only."
              />
              <ComboboxField
                label="Barangay *"
                placeholder="Select barangay..."
                options={barangayOptions}
                icon={MapPin}
                value={householdData.barangay || ""}
                onValueChange={(val) => handleFieldChange("barangay", val)}
                error={validationErrors.barangay}
              />
              <InputField
                id="houseNoStreet"
                label="House No. / Street Name / Subdivision"
                placeholder="e.g., Blk 4 Lot 44, Sainte St."
                value={householdData.houseNoStreet || ""}
                onChange={(e) => handleFieldChange("houseNoStreet", e.target.value)}
                icon={House}
                error={validationErrors.houseNoStreet}
              />
              <InputField
                id="purok"
                label="Purok / Zone / Phase"
                placeholder="e.g., Purok 9"
                value={householdData.purok || ""}
                onChange={(e) => handleFieldChange("purok", e.target.value)}
                icon={Signpost}
                error={validationErrors.purok}
              />
              <NumberField
                id="numberOfFamilies"
                label="No. of Family/ies in the HH *"
                placeholder="e.g., 1"
                type="number"
                value={householdData.numberOfFamilies || ""}
                onChange={(e) => handleFieldChange("numberOfFamilies", parseInt(e.target.value))}
                error={validationErrors.numberOfFamilies}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Respondent Profile</FieldLegend>
            <FieldDescription>Information about the household respondents.</FieldDescription>
            <FieldGroup>
              <InputField
                label="Last Name *"
                placeholder="Dela Cruz"
                onChange={(e) => handleFieldChange("respondentLastName", e.target.value)}
                value={householdData.respondentLastName || ""}
                error={validationErrors.respondentLastName}
                id="respondentLastName"
              />
              <InputField
                label="First Name *"
                placeholder="Juan"
                onChange={(e) => handleFieldChange("respondentFirstName", e.target.value)}
                value={householdData.respondentFirstName || ""}
                error={validationErrors.respondentFirstName}
                id="respondentFirstName"
              />
              <InputField
                label="Middle Name"
                placeholder="Optional"
                value={householdData.respondentMiddleName || ""}
                onChange={(e) => handleFieldChange("respondentMiddleName", e.target.value)}
                id="respondentMiddleName"
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend>Water & Sanitation</FieldLegend>
            <FieldDescription>Details regarding water source and toilet facility.</FieldDescription>
            <FieldGroup>
              <ComboboxField
                label="Type of Water Source *"
                placeholder="Select water source"
                options={waterSourceOptions}
                icon={Droplet}
                showAbbreviation
                value={householdData.waterSource || ""}
                onValueChange={(val) => handleFieldChange("waterSource", val)}
                error={validationErrors.waterSource} />
              <ComboboxField
                label="Type of Toilet Facility *"
                placeholder="Select toilet facility"
                options={toiletFacilityOptions}
                showAbbreviation
                icon={Toilet}
                value={householdData.toiletFacility || ""}
                onValueChange={(val) => handleFieldChange("toiletFacility", val)}
                error={validationErrors.toiletFacility}
              />
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}
