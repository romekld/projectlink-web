"use client"

import { useCallback, useMemo, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dynamic from "next/dynamic"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  memberFormSchema,
  type MemberFormValues,
} from "../schemas/household-form-schema"

const MemberInfoForm = dynamic(
  () => import("./forms/form-member-info").then((m) => m.MemberInfoForm),
  { ssr: false },
)

interface DrawerAddMemberProps {
  triggerLabel?: string
  editingMember?: MemberFormValues
  editingIndex?: number
  onSave?: (data: MemberFormValues) => void
  onClose?: () => void
  variant?: "default" | "outline"
  buttonClassName?: string
  hideTrigger?: boolean
  householdIs4ps?: boolean
  householdIs4psId?: string
  householdIsIndigenous?: boolean
}

function buildDefaultMemberValues(
  editing?: MemberFormValues,
  householdIs4ps?: boolean,
  householdIs4psId?: string,
  householdIsIndigenous?: boolean,
): MemberFormValues {
  if (editing) {
    return {
      ...editing,
      middleName: editing.middleName ?? "",
      education: editing.education ?? "",
      religion: editing.religion ?? "",
      is4psId: editing.is4psId ?? "",
      philhealthId: editing.philhealthId ?? "",
      philhealthMembershipType: editing.philhealthMembershipType ?? "M",
      philhealthCategory: editing.philhealthCategory ?? "",
      lmpDate: editing.lmpDate ?? "",
      fpStatus: editing.fpStatus ?? "",
      age: editing.age ?? 0,
      ageGroup: editing.ageGroup ?? "",
      isPregnant: editing.isPregnant ?? false,
    }
  }

  return {
    lastName: "",
    firstName: "",
    middleName: "",
    sex: "female",
    dateOfBirth: "",
    relationship: "",
    civilStatus: "",
    education: "",
    religion: "",
    is4ps: householdIs4ps ?? false,
    is4psId: householdIs4ps ? (householdIs4psId ?? "") : "",
    isIndigenous: householdIsIndigenous ?? false,
    isPhilhealthMember: false,
    philhealthId: "",
    philhealthMembershipType: "M",
    philhealthCategory: "",
    medicalHistory: [],
    lmpDate: "",
    usingFP: false,
    fpMethods: [],
    fpStatus: "",
    age: 0,
    ageGroup: "",
    isPregnant: false,
  }
}

export function DrawerAddMember({
  triggerLabel = "Add Member",
  editingMember,
  editingIndex,
  onSave,
  onClose,
  variant = "default",
  buttonClassName,
  hideTrigger,
  householdIs4ps,
  householdIs4psId,
  householdIsIndigenous,
}: DrawerAddMemberProps) {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(editingMember !== undefined || editingIndex !== undefined)

  const defaultValues = useMemo(
    () => buildDefaultMemberValues(editingMember, householdIs4ps, householdIs4psId, householdIsIndigenous),
    [editingMember, householdIs4ps, householdIs4psId, householdIsIndigenous],
  )

  const memberForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { reset } = memberForm

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
        if (!nextOpen) {
          if (editingMember || editingIndex !== undefined) {
            onClose?.()
          }
          reset(buildDefaultMemberValues(undefined, householdIs4ps, householdIs4psId, householdIsIndigenous))
        }
      },
      [editingMember, editingIndex, onClose, reset, householdIs4ps, householdIs4psId, householdIsIndigenous],
  )

  const handleSubmit = useCallback(
    (data: MemberFormValues) => {
      onSave?.(data)
      setOpen(false)
      onClose?.()
      reset(buildDefaultMemberValues(undefined, householdIs4ps, householdIs4psId, householdIsIndigenous))
    },
    [onSave, onClose, reset, householdIs4ps, householdIs4psId, householdIsIndigenous],
  )

  return (
    <Drawer modal open={open} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DrawerTrigger asChild>
          <Button size="lg" variant={variant} className={buttonClassName}>
            <PlusIcon />
            {triggerLabel}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="!h-[92dvh] !max-h-[92dvh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>{editingMember ? "Edit Member" : "Add Member"}</DrawerTitle>
        </DrawerHeader>
        <div ref={setContainerEl} className="overflow-y-auto p-6 flex flex-col gap-4">
          <FormProvider {...memberForm}>
            <form onSubmit={memberForm.handleSubmit(handleSubmit)}>
              <MemberInfoForm
                comboboxContainer={containerEl}
                  onCancel={() => {
                    setOpen(false)
                    onClose?.()
                    reset(buildDefaultMemberValues(undefined, householdIs4ps, householdIs4psId, householdIsIndigenous))
                  }}
              />
            </form>
          </FormProvider>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
