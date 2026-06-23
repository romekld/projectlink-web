"use client"

import { useCallback, useState } from "react"
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

import { useWizardStore } from "../stores/wizard-store"
import type { HouseholdMember } from "../stores/wizard-store"

const MemberInfoForm = dynamic(
    () => import("./forms/form-member-info").then((m) => m.MemberInfoForm),
    { ssr: false },
)

interface DrawerAddMemberProps {
    triggerLabel?: string
    editingMember?: HouseholdMember
    onClose?: () => void
    variant?: "default" | "outline"
    buttonClassName?: string
    hideTrigger?: boolean
}

export function DrawerAddMember({ triggerLabel = "Add Member", editingMember, onClose, variant = "default", buttonClassName, hideTrigger }: DrawerAddMemberProps) {
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(editingMember !== undefined)
    const addMember = useWizardStore((s) => s.addMember)
    const updateMember = useWizardStore((s) => s.updateMember)

    const handleOpenChange = useCallback((nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen && editingMember) {
            onClose?.()
        }
    }, [editingMember, onClose])

    const handleSubmit = useCallback((data: Omit<HouseholdMember, "id">) => {
        if (editingMember) {
            updateMember(editingMember.id, data)
        } else {
            const member: HouseholdMember = {
                id: crypto.randomUUID(),
                ...data,
            }
            addMember(member)
        }
        setOpen(false)
        onClose?.()
    }, [editingMember, addMember, updateMember, onClose])

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
                    <MemberInfoForm
                        comboboxContainer={containerEl}
                        initialData={editingMember}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setOpen(false)
                            onClose?.()
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
