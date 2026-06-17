"use client"

import * as React from "react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useHouseholdWizard, HouseholdMember } from "@/lib/store/household-wizard"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CoreIdentityStep } from "./form/steps/core-identity-step"
import { SocioEconomicStep } from "./form/steps/socio-economic-step"
import { ClinicalReproductiveStep } from "./form/steps/clinical-reproductive-step"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import { memberSchema } from "../data/form-schema"
import { z } from "zod"

export function AddDrawerScrollable() {
    const { 
        addMember, 
        updateMember, 
        members, 
        editingMemberId, 
        setEditingMember, 
        isEditingDrawerOpen, 
        setEditingDrawerOpen 
    } = useHouseholdWizard()
    const [open, setOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<Record<string, unknown>>({})
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const hasHead = members.some(m => m.relationshipToHhHead === "1" || m.relationshipToHhHead === "1-Head")
    const isAddingHead = !hasHead && !editingMemberId

    // Sync drawer open state with store for editing
    React.useEffect(() => {
        if (isEditingDrawerOpen) {
            setOpen(true)
        }
    }, [isEditingDrawerOpen])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setEditingDrawerOpen(false)
            setEditingMember(null)
        }
    }

    // Reset form when drawer opens/closes or when editingMemberId changes
    React.useEffect(() => {
        if (open) {
            if (editingMemberId) {
                const memberToEdit = members.find(m => m.id === editingMemberId)
                if (memberToEdit) {
                    setFormData({
                        ...memberToEdit,
                        relationship: memberToEdit.relationshipToHhHead === "1-Head" ? "1" : memberToEdit.relationshipToHhHead
                    })
                }
            } else {
                setFormData({
                    lastName: "",
                    firstName: "",
                    middleName: "",
                    relationship: isAddingHead ? "1" : "",
                    sex: "male",
                    dateOfBirth: "",
                    civilStatus: "",
                    education: "",
                    religion: "",
                })
            }
            setErrors({})
        }
    }, [open, editingMemberId, isAddingHead, members])

    const handleSubmit = () => {
        // Clear previous errors
        setErrors({})

        // Use Zod to validate member data
        const validation = memberSchema.safeParse({
            id: editingMemberId || crypto.randomUUID(),
            lastName: formData.lastName || "",
            firstName: formData.firstName || "",
            middleName: formData.middleName || "",
            relationshipToHhHead: formData.relationship || (isAddingHead ? "1" : ""),
            sex: formData.sex || "male",
            dateOfBirth: formData.dateOfBirth || "",
            age: formData.age || "",
            civilStatus: formData.civilStatus || "",
            education: formData.education || "",
            religion: formData.religion || "",
            isIndigenousPeople: !!formData.isIndigenousPeople,
            philhealthId: formData.philhealthId || "",
            membershipType: formData.membershipType || "",
            philhealthCategory: formData.philhealthCategory || "",
            medicalHistory: formData.medicalHistory || [],
            medicalOther: formData.medicalOther || "",
            classification: formData.classification || "",
            usingFp: !!formData.usingFp,
            fpMethod: formData.fpMethod || "",
            fpStatus: formData.fpStatus || "",
            lmp: formData.lmp || "",
        })

        if (!validation.success) {
            const newErrors: Record<string, string> = {}
            validation.error.issues.forEach(err => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message
                }
            })
            setErrors(newErrors)
            toast.error("Please fill in all required member fields.", { position: "top-center" })
            return
        }

        if (editingMemberId) {
            updateMember(editingMemberId, validation.data as any)
            toast.success(`${validation.data.firstName} updated.`, { position: "top-center" })
        } else {
            addMember(validation.data as any)
            toast.success(`${validation.data.firstName} added to household.`, { position: "top-center" })
        }
        
        handleOpenChange(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const onDataChange = (newData: Record<string, unknown>) => {
        setFormData({ ...formData, ...newData })
        // Clear error for field when changed
        const fieldChanged = Object.keys(newData)[0]
        if (fieldChanged) {
            const errorKey = fieldChanged === "relationship" ? "relationshipToHhHead" : fieldChanged
            if (errors[errorKey]) {
                setErrors(prev => {
                    const next = { ...prev }
                    delete next[errorKey]
                    return next
                })
            }
        }
    }

    const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button variant={isAddingHead ? "default" : "outline"} className={cn(isAddingHead ? "" : "w-full")}>
                    <Plus />
                    {isAddingHead ? "Add Household Head" : "Add Member"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="!h-[92dvh] !max-h-[92dvh]">
                <div ref={setContainer} className="flex flex-col h-full overflow-hidden">
                    <DrawerHeader className="p-0 border-b">
                        <div className="px-6 py-3">
                            <DrawerTitle>
                                {editingMemberId ? "Edit Household Member" : (isAddingHead ? "Add the Household Head" : "Add Household Member")}
                            </DrawerTitle>
                        </div>
                    </DrawerHeader>

                    <div className="no-scrollbar overflow-y-auto p-4">
                        
                        {/* Section 1: Identity & Demographics */}
                        <FieldGroup >
                            <CoreIdentityStep
                                data={formData}
                                onDataChange={onDataChange}
                                onNext={() => { }}
                                onPrevious={() => { }}
                                isFirstStep={true}
                                isLastStep={false}
                                errors={errors}
                                container={container}
                            />
                            <FieldSeparator/>

                            {/* Section 2: Socio-Economic & Coverage */}

                            <SocioEconomicStep
                                data={formData}
                                onDataChange={onDataChange}
                                onNext={() => { }}
                                onPrevious={() => { }}
                                isFirstStep={false}
                                isLastStep={false}
                                errors={errors}
                            />
                            <FieldSeparator/>

                            <ClinicalReproductiveStep
                                data={formData}
                                onDataChange={onDataChange}
                                onNext={() => { }}
                                onPrevious={() => { }}
                                isFirstStep={false}
                                isLastStep={true}
                                errors={errors}
                            />
                        </FieldGroup>

                    </div>

                    {/* <DrawerFooter className="p-0">
                        <div className="flex items-center justify-between py-4 px-6">
                            <span className="text-sm font-semibold">
                                Single Page Form
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>
                                    Save Member
                                </Button>
                            </div>
                        </div>
                    </DrawerFooter> */}
                    <DrawerFooter className="grid grid-cols-2 gap-2">
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer >
    )
}
