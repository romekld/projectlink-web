"use client"

import { useState } from "react"
import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import { Header } from "../layout/header"
import { EmptyState } from "../empty"
import { DrawerAddMember } from "../drawer-add-member"
import { CardMember } from "../card-member"
import type { HouseholdFormValues, MemberFormValues } from "../../schemas/household-form-schema"
import { useWizardStore } from "../../stores/wizard-store"

export function Step3MemberInfo() {
  const { control } = useFormContext<HouseholdFormValues>()

  const householdIs4ps = useWatch({ control, name: "is4ps" })
  const householdIs4psId = useWatch({ control, name: "is4psId" })
  const householdIsIndigenous = useWatch({ control, name: "isIndigenous" })

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "members",
  })

  const addMemberToStore = useWizardStore((s) => s.addMember)
  const updateMemberInStore = useWizardStore((s) => s.updateMember)
  const deleteMemberFromStore = useWizardStore((s) => s.deleteMember)

  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const editingMember = editingIndex !== null ? fields[editingIndex] : undefined

  const handleAppend = (data: MemberFormValues) => {
    append(data)
    addMemberToStore({
      id: globalThis.crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      lastName: data.lastName,
      firstName: data.firstName,
      middleName: data.middleName ?? "",
      sex: data.sex,
      dateOfBirth: data.dateOfBirth,
      age: data.age ?? 0,
      ageGroup: data.ageGroup ?? "",
      relationship: data.relationship,
      civilStatus: data.civilStatus,
      education: data.education ?? "",
      religion: data.religion ?? "",
      is4ps: data.is4ps,
      is4psId: data.is4psId ?? "",
      isIndigenous: data.isIndigenous,
      isPhilhealthMember: data.isPhilhealthMember,
      philhealthId: data.philhealthId ?? "",
      philhealthMembershipType: data.philhealthMembershipType ?? "M",
      philhealthCategory: data.philhealthCategory ?? "",
      medicalHistory: data.medicalHistory ?? [],
      lmpDate: data.lmpDate ?? "",
      usingFP: data.usingFP,
      fpMethods: data.fpMethods ?? [],
      fpStatus: data.fpStatus ?? "",
      isPregnant: data.isPregnant ?? false,
    })
  }

  const handleUpdate = (index: number, data: MemberFormValues) => {
    update(index, data)
    const storeMembers = useWizardStore.getState().members
    const existing = storeMembers[index]
    if (existing) {
      updateMemberInStore(existing.id, {
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName ?? "",
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        age: data.age ?? 0,
        ageGroup: data.ageGroup ?? "",
        relationship: data.relationship,
        civilStatus: data.civilStatus,
        education: data.education ?? "",
        religion: data.religion ?? "",
        is4ps: data.is4ps,
        is4psId: data.is4psId ?? "",
        isIndigenous: data.isIndigenous,
        isPhilhealthMember: data.isPhilhealthMember,
        philhealthId: data.philhealthId ?? "",
        philhealthMembershipType: data.philhealthMembershipType ?? "M",
        philhealthCategory: data.philhealthCategory ?? "",
        medicalHistory: data.medicalHistory ?? [],
        lmpDate: data.lmpDate ?? "",
        usingFP: data.usingFP,
        fpMethods: data.fpMethods ?? [],
        fpStatus: data.fpStatus ?? "",
        isPregnant: data.isPregnant ?? false,
      })
    }
  }

  const handleDelete = (index: number) => {
    remove(index)
    const storeMembers = useWizardStore.getState().members
    const memberToRemove = storeMembers[index]
    if (memberToRemove) {
      deleteMemberFromStore(memberToRemove.id)
    }
  }

  return (
    <>
      <Header title="Step 3: Members" description="Enter information about the household members." />

      {fields.length === 0 ? (
        <section className="p-6 flex flex-1 items-center justify-center">
          <EmptyState
            onAddMember={handleAppend}
            householdIs4ps={householdIs4ps}
            householdIs4psId={householdIs4psId}
            householdIsIndigenous={householdIsIndigenous}
          />
        </section>
      ) : (
        <section className="p-6 flex flex-col gap-4 flex-1 items-center">
          {fields.map((field, index) => {
            const member = field as unknown as MemberFormValues
            const fullName = `${member.lastName}, ${member.firstName}${member.middleName ? ` ${member.middleName}` : ""}`
            return (
              <CardMember
                key={field.id}
                fullName={fullName}
                sex={member.sex}
                dateOfBirth={member.dateOfBirth!}
                ageGroup={member.ageGroup ?? ""}
                civilStatus={member.civilStatus}
                religion={member.religion ?? ""}
                education={member.education ?? ""}
                relationship={member.relationship}
                onEdit={() => setEditingIndex(index)}
                onDelete={() => handleDelete(index)}
              />
            )
          })}
          <DrawerAddMember
            triggerLabel="Add Another Member"
            variant="outline"
            buttonClassName="w-full"
            onSave={handleAppend}
            householdIs4ps={householdIs4ps}
            householdIs4psId={householdIs4psId}
            householdIsIndigenous={householdIsIndigenous}
          />
        </section>
      )}

      {editingMember && (
        <DrawerAddMember
          hideTrigger
          editingMember={editingMember as unknown as MemberFormValues}
          editingIndex={editingIndex ?? undefined}
          onSave={(data) => {
            if (editingIndex !== null) {
              handleUpdate(editingIndex, data)
            }
          }}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  )
}
