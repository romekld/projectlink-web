"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Hash, House, Signpost, MapPin, Toilet, Droplet } from "lucide-react"
import { useHouseholdWizard, HouseholdData } from "@/lib/store/household-wizard"
import { step1Schema, HouseholdValues } from "../../data/form-schema"
import { ComboboxField } from "../combobox-field"
import { NumberField } from "../number-field"
import { InputField } from "../input-field"
import { DatePicker } from "../date-picker"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toiletFacilityOptions, waterSourceOptions } from "../../data"
import type { BarangayOption } from "../../services/barangay-service"

const QUARTER_OPTIONS = [
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th" },
] as const

function currentQuarter(): 1 | 2 | 3 | 4 {
  return (Math.floor(new Date().getMonth() / 3) + 1) as 1 | 2 | 3 | 4
}

type BasicInfoFormProps = {
  barangays: BarangayOption[]
  defaultBarangayId?: string | null
}

export function BasicInfoForm({ barangays, defaultBarangayId }: BasicInfoFormProps) {
  const { householdData, setHouseholdData, validationErrors, setValidationError } = useHouseholdWizard()

  const barangayOptions = barangays.map((barangay) => ({
    value: barangay.id,
    label: barangay.name,
  }))

  const {
    handleSubmit,
    setValue,
  } = useForm<HouseholdValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      visitDate: householdData.visitDate || new Date().toISOString().split("T")[0],
      quarter: householdData.quarter || currentQuarter(),
      barangayId: householdData.barangayId || "",
      respondentLastName: householdData.respondentLastName || "",
      respondentFirstName: householdData.respondentFirstName || "",
      waterSource: householdData.waterSource as "Level I" | "Level II" | "Level III",
      toiletFacility: householdData.toiletFacility as "Sanitary-VIP" | "Sanitary-Septic" | "Unsanitary-Open" | "None",
      houseNoStreet: householdData.houseNoStreet || "",
      purok: householdData.purok || "",
      familyCount: householdData.familyCount && householdData.familyCount >= 1 ? householdData.familyCount : 1,
    },
  })

  const handleFieldChange = (
    field: keyof HouseholdData | keyof HouseholdValues,
    value: string | number | undefined | null
  ) => {
    setHouseholdData({ [field]: value })
    if (validationErrors[field as string]) {
      setValidationError(field as string, "")
    }
  }

  const handleBarangayChange = (barangayId: string) => {
    const barangayName = barangays.find((barangay) => barangay.id === barangayId)?.name
    setHouseholdData({
      barangayId,
      ...(barangayName ? { barangayName } : {}),
    })
    setValue("barangayId", barangayId)
    if (validationErrors.barangayId) {
      setValidationError("barangayId", "")
    }
  }

  // Ensure family count and quarter always have valid defaults
  useEffect(() => {
    const updates: Partial<HouseholdData> = {}

    if (!householdData.familyCount || householdData.familyCount < 1) {
      updates.familyCount = 1
    }

    if (!householdData.quarter) {
      updates.quarter = currentQuarter()
    }

    if (Object.keys(updates).length > 0) {
      setHouseholdData(updates)
    }
  }, [householdData.familyCount, householdData.quarter, setHouseholdData])

  // Sync react-hook-form with store data
  useEffect(() => {
    if (householdData.visitDate) setValue("visitDate", householdData.visitDate)
    if (householdData.barangayId) setValue("barangayId", householdData.barangayId)
    if (householdData.respondentLastName) setValue("respondentLastName", householdData.respondentLastName)
    if (householdData.respondentFirstName) setValue("respondentFirstName", householdData.respondentFirstName)
    if (householdData.waterSource) {
      setValue("waterSource", householdData.waterSource as "Level I" | "Level II" | "Level III")
    }
    if (householdData.toiletFacility) {
      setValue(
        "toiletFacility",
        householdData.toiletFacility as "Sanitary-VIP" | "Sanitary-Septic" | "Unsanitary-Open" | "None"
      )
    }
    if (householdData.houseNoStreet) setValue("houseNoStreet", householdData.houseNoStreet)
    if (householdData.purok) setValue("purok", householdData.purok)
    if (householdData.familyCount && householdData.familyCount >= 1) {
      setValue("familyCount", householdData.familyCount)
    }
    if (householdData.quarter) setValue("quarter", householdData.quarter as 1 | 2 | 3 | 4)
  }, [householdData, setValue])

  const onSubmit = (data: HouseholdValues) => {
    setHouseholdData(data)
  }

  const selectedQuarter = householdData.quarter ?? currentQuarter()

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <header className="p-5 border-b">
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Basic Information</h1>
          <p className="text-sm text-muted-foreground">
            Please provide the basic information of the household.
          </p>
        </header>
        <FieldGroup className="p-5">

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
                      const dateString = date.toISOString().split("T")[0]
                      handleFieldChange("visitDate", dateString)
                    }
                  }}
                  aria-invalid={!!validationErrors.visitDate}
                />
                {validationErrors.visitDate ? (
                  <FieldError>{validationErrors.visitDate}</FieldError>
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="quarter">Quarter</FieldLabel>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={String(selectedQuarter)}
                  onValueChange={(nextValue) => {
                    if (!nextValue) return
                    const quarter = Number(nextValue) as 1 | 2 | 3 | 4
                    handleFieldChange("quarter", quarter)
                    setValue("quarter", quarter)
                  }}
                  className="w-full"
                >
                  {QUARTER_OPTIONS.map((quarter) => (
                    <ToggleGroupItem
                      key={quarter.value}
                      value={String(quarter.value)}
                      aria-label={`${quarter.label} quarter`}
                      className="flex-1"
                    >
                      {quarter.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
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
                defaultValue={defaultBarangayId || ""}
                value={householdData.barangayId}
                onValueChange={handleBarangayChange}
                error={validationErrors.barangayId}
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
                id="familyCount"
                label="No. of Family/ies in the HH *"
                placeholder="e.g., 1"
                type="number"
                min={1}
                value={householdData.familyCount && householdData.familyCount >= 1 ? householdData.familyCount : 1}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10)
                  handleFieldChange("familyCount", Number.isNaN(parsed) ? 1 : Math.max(1, parsed))
                }}
                error={validationErrors.familyCount}
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
                error={validationErrors.waterSource}
              />
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
