"use client"

import { useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  householdFormSchema,
  stepFieldMap,
  type HouseholdFormValues,
} from "../../schemas/household-form-schema"
import { useWizardStore, type WizardStepId } from "../../stores/wizard-store"

function buildDefaultsFromStore(
  formData: ReturnType<typeof useWizardStore.getState>["formData"],
  members: ReturnType<typeof useWizardStore.getState>["members"],
  pinLocation: ReturnType<typeof useWizardStore.getState>["pinLocation"],
): HouseholdFormValues {
  return {
    barangay: formData.barangay,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2 ?? "",
    respondentLastName: formData.respondentLastName,
    respondentFirstName: formData.respondentFirstName,
    respondentMiddleName: formData.respondentMiddleName ?? "",
    waterSource: formData.waterSource,
    toiletFacility: formData.toiletFacility,
    visitDate: formData.visitDate,
    familyCount: formData.familyCount,
    is4ps: formData.is4ps,
    is4psId: formData.is4psId ?? "",
    isIndigenous: formData.isIndigenous,
    latitude: pinLocation?.lat ?? 0,
    longitude: pinLocation?.lng ?? 0,
    members: members.map((m) => ({
      lastName: m.lastName,
      firstName: m.firstName,
      middleName: m.middleName ?? "",
      sex: m.sex,
      dateOfBirth: m.dateOfBirth,
      relationship: m.relationship,
      civilStatus: m.civilStatus,
      education: m.education ?? "",
      religion: m.religion ?? "",
      is4ps: m.is4ps,
      is4psId: m.is4psId ?? "",
      isIndigenous: m.isIndigenous,
      isPhilhealthMember: m.isPhilhealthMember,
      philhealthId: m.philhealthId ?? "",
      philhealthMembershipType: (m.philhealthMembershipType as "M" | "D") ?? "M",
      philhealthCategory: m.philhealthCategory ?? "",
      medicalHistory: m.medicalHistory ?? [],
      lmpDate: m.lmpDate ?? "",
      usingFP: m.usingFP,
      fpMethods: m.fpMethods ?? [],
      fpStatus: m.fpStatus ?? "",
      age: m.age ?? 0,
      ageGroup: m.ageGroup ?? "",
      isPregnant: m.isPregnant ?? false,
    })),
  }
}

export function useHouseholdForm() {
  const formData = useWizardStore((s) => s.formData)
  const members = useWizardStore((s) => s.members)
  const pinLocation = useWizardStore((s) => s.pinLocation)
  const setFormData = useWizardStore((s) => s.setFormData)
  const setPinLocation = useWizardStore((s) => s.setPinLocation)

  const defaultValues = useMemo(
    () => buildDefaultsFromStore(formData, members, pinLocation),
    // only run once on mount — store is single source of truth
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const form = useForm<HouseholdFormValues>({
    resolver: zodResolver(householdFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const validateStep = useCallback(
    async (step: WizardStepId): Promise<boolean> => {
      const fields = stepFieldMap[step]
      if (!fields || fields.length === 0) return true
      return await form.trigger(fields as unknown as (keyof HouseholdFormValues)[])
    },
    [form],
  )

  const syncToStore = useCallback(() => {
    const values = form.getValues()
    setFormData({
      barangay: values.barangay,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 ?? "",
      respondentLastName: values.respondentLastName,
      respondentFirstName: values.respondentFirstName,
      respondentMiddleName: values.respondentMiddleName ?? "",
      waterSource: values.waterSource,
      toiletFacility: values.toiletFacility,
      visitDate: values.visitDate,
      familyCount: values.familyCount,
      is4ps: values.is4ps,
      is4psId: values.is4psId ?? "",
      isIndigenous: values.isIndigenous,
    })
    setPinLocation({ lng: values.longitude, lat: values.latitude })
  }, [form, setFormData, setPinLocation])

  return {
    form,
    validateStep,
    syncToStore,
  }
}
