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

export function AddDrawerScrollable() {
    const { addMember, members } = useHouseholdWizard()
    const [open, setOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<Record<string, unknown>>({})

    const hasHead = members.some(m => m.relationshipToHhHead === "1-Head")
    const isAddingHead = !hasHead

    // Reset form when drawer opens/closes
    React.useEffect(() => {
        if (open) {
            setFormData(isAddingHead ? { relationship: "1-Head" } : {})
        }
    }, [open, isAddingHead])

    const handleSubmit = () => {
        // Create a new member from the form data
        const newMember: HouseholdMember = {
            id: crypto.randomUUID(),
            lastName: (formData.lastName as string) || "",
            firstName: (formData.firstName as string) || "",
            middleName: (formData.middleName as string) || "",
            relationshipToHhHead: (formData.relationship as string) || (isAddingHead ? "1-Head" : ""),
            sex: (formData.sex as string) || "M",
            dateOfBirth: (formData.dateOfBirth as string) || "",
            age: (formData.age as string) || "",
            civilStatus: (formData.civilStatus as string) || "",
            education: (formData.education as string) || "",
            religion: (formData.religion as string) || "",
            isIndigenousPeople: (formData.isIndigenousPeople as boolean) || false,
            philhealthId: (formData.philhealthId as string) || "",
            membershipType: (formData.membershipType as string) || "",
            philhealthCategory: (formData.philhealthCategory as string) || "",
            medicalHistory: (formData.medicalHistory as string[]) || [],
            classification: (formData.classification as string) || "",
            usingFp: (formData.usingFp as boolean) || false,
            fpMethod: (formData.fpMethod as string) || "",
            fpStatus: (formData.fpStatus as string) || "",
            waterSource: (formData.waterSource as string) || "",
            toiletFacility: (formData.toiletFacility as string) || "",
        }

        addMember(newMember)
        toast.success(`${newMember.firstName} added to household.`, { position: "top-center" })
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    const onDataChange = (newData: Record<string, unknown>) => {
        setFormData({ ...formData, ...newData })
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={isAddingHead ? "default" : "outline"} className={cn(isAddingHead ? "" : "w-full")}>
                    <Plus />
                    {isAddingHead ? "Add Household Head" : "Add Member"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="!h-[92dvh] !max-h-[92dvh]">
                <DrawerHeader className="p-0 border-b">
                    <div className="px-6 py-3">
                        <DrawerTitle>
                            {isAddingHead ? "Add the Household Head" : "Add Household Member"}
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
                        />
                        <FieldSeparator/>

                        <ClinicalReproductiveStep
                            data={formData}
                            onDataChange={onDataChange}
                            onNext={() => { }}
                            onPrevious={() => { }}
                            isFirstStep={false}
                            isLastStep={true}
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
            </DrawerContent>
        </Drawer >
    )
}
