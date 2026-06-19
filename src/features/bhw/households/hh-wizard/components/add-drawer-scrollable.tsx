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
import { autoSuggestClassification } from "../data/classification"

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

    const hasHead = members.some(m => m.relationshipToHhHead === "Head")
    const isAddingHead = !hasHead && !editingMemberId

    // Sync drawer open state with store for editing
    React.useEffect(() => {
        if (isEditingDrawerOpen) {
            queueMicrotask(() => setOpen(true))
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
            queueMicrotask(() => {
                if (editingMemberId) {
                    const memberToEdit = members.find(m => m.id === editingMemberId)
                    if (memberToEdit) {
                        setFormData({
                            ...memberToEdit,
                            birthdate: memberToEdit.dateOfBirth, // map store dateOfBirth to form birthdate
                            relationship: memberToEdit.relationshipToHhHead
                        })
                    }
                } else {
                    setFormData({
                        lastName: "",
                        firstName: "",
                        middleName: "",
                        relationship: isAddingHead ? "Head" : "",
                        sex: "M",
                        birthdate: "",
                        civilStatus: "",
                        nhtsStatus: "Non-4Ps",
                        fourPsId: "",
                        philhealthId: "",
                        phCategory: "Unknown",
                        membershipType: "",
                        medicalHistory: [],
                        medicalOther: "",
                        isPregnant: false,
                        lmp: "",
                        usingFp: false,
                        fpMethod: "",
                        fpMethodOther: "",
                        fpStatus: "",
                        education: "",
                        religion: "",
                        specifyReligion: "",
                    })
                }
                setErrors({})
            })
        }
    }, [open, editingMemberId, isAddingHead, members])

    const handleSubmit = () => {
        // Clear previous errors
        setErrors({})

        const birthdate = (formData.birthdate as string) || ""
        const sex = (formData.sex as "M" | "F") || "M"
        
        // Auto-compute classification
        const computedClassification = autoSuggestClassification(birthdate, sex)

        // Use Zod to validate member data
        const validation = memberSchema.safeParse({
            lastName: formData.lastName || "",
            firstName: formData.firstName || "",
            middleName: formData.middleName || "",
            birthdate: birthdate,
            sex: sex,
            relationship: formData.relationship || (isAddingHead ? "Head" : ""),
            specifyRelation: formData.specifyRelation || "",
            civilStatus: formData.civilStatus || "",
            nhtsStatus: formData.nhtsStatus || "Non-4Ps",
            fourPsId: formData.fourPsId || "",
            philhealthId: formData.philhealthId || "",
            phCategory: formData.phCategory || "Unknown",
            medicalHistory: formData.medicalHistory || [],
            medicalOther: formData.medicalOther || "",
            classification: computedClassification || "",
            isPregnant: !!formData.isPregnant,
            lmp: formData.lmp || "",
            usingFp: !!formData.usingFp,
            fpMethod: formData.fpMethod || "",
            fpMethodOther: formData.fpMethodOther || "",
            fpStatus: formData.fpStatus || "",
            education: formData.education || "",
            specifyReligion: formData.specifyReligion || "",
            metadata: formData.metadata || {},
        })

        if (!validation.success) {
            const newErrors: Record<string, string> = {}
            validation.error.issues.forEach(err => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message
                }
            })
            setErrors(newErrors)
            toast.error("Please correct the errors in the form.", { position: "top-center" })
            return
        }

        const memberData: HouseholdMember = {
            id: editingMemberId || crypto.randomUUID(),
            lastName: validation.data.lastName,
            firstName: validation.data.firstName,
            middleName: validation.data.middleName,
            relationshipToHhHead: validation.data.relationship,
            sex: validation.data.sex,
            dateOfBirth: validation.data.birthdate, // store expects dateOfBirth
            age: (formData.age as string) || "",
            civilStatus: validation.data.civilStatus,
            education: validation.data.education,
            religion: validation.data.religion,
            isIndigenousPeople: !!formData.isIndigenousPeople,
            philhealthId: validation.data.philhealthId,
            membershipType: "", // Added to match interface if needed
            philhealthCategory: validation.data.phCategory,
            medicalHistory: validation.data.medicalHistory,
            classification: validation.data.classification,
            usingFp: validation.data.usingFp,
            fpMethod: validation.data.fpMethod,
            fpMethodOther: validation.data.fpMethodOther,
            fpStatus: (formData.fpStatus as string) || "",
            // Additional fields for local state mapping if needed
            ...formData, // include other fields like specifyRelation, etc.
        } as unknown as HouseholdMember

        if (editingMemberId) {
            updateMember(editingMemberId, memberData)
            toast.success(`${validation.data.firstName} updated.`, { position: "top-center" })
        } else {
            addMember(memberData)
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
            if (errors[fieldChanged]) {
                setErrors(prev => {
                    const next = { ...prev }
                    delete next[fieldChanged]
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
