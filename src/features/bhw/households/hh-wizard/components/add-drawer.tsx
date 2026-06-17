"use client"

import * as React from "react"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Wizard, WizardContent, WizardFooter, WizardProgress } from "./form/wizard"
import { CoreIdentityStep } from "./form/steps/core-identity-step"
import { SocioEconomicStep } from "./form/steps/socio-economic-step"
import { ClinicalReproductiveStep } from "./form/steps/clinical-reproductive-step"
import { useHouseholdWizard, HouseholdMember } from "@/lib/store/household-wizard"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AddDrawer() {
    const { addMember, members } = useHouseholdWizard()
    const [open, setOpen] = React.useState(false)
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

    const hasHead = members.some(m => m.relationshipToHhHead === "Head")
    const isFirstMember = members.length === 0
    const isAddingHead = !hasHead

    const steps = React.useMemo(() => [
        { id: "identity", title: "Identity & Demographics", component: (props: any) => <CoreIdentityStep {...props} container={container} /> },
        { id: "socio-economic", title: "Socio-Economic & Coverage", component: SocioEconomicStep },
        { id: "clinical", title: "Health & Reproductive", component: ClinicalReproductiveStep },
    ], [container])

    const handleSubmit = (data: Record<string, unknown>) => {
        // Create a new member from the form data
        const newMember: HouseholdMember = {
            id: crypto.randomUUID(),
            lastName: (data.lastName as string) || "",
            firstName: (data.firstName as string) || "",
            middleName: (data.middleName as string) || "",
            relationshipToHhHead: (data.relationship as string) || (isFirstMember ? "Head" : ""),
            sex: (data.sex as string) || "M",
            dateOfBirth: (data.dateOfBirth as string) || "",
            age: (data.age as string) || "",
            civilStatus: (data.civilStatus as string) || "",
            education: (data.education as string) || "",
            religion: (data.religion as string) || "",
            isIndigenousPeople: (data.isIndigenousPeople as boolean) || false,
            philhealthId: (data.philhealthId as string) || "",
            membershipType: (data.membershipType as string) || "",
            philhealthCategory: (data.philhealthCategory as string) || "",
            medicalHistory: (data.medicalHistory as string[]) || [],
            classification: (data.classification as string) || "",
            usingFp: (data.usingFp as boolean) || false,
            fpMethod: (data.fpMethod as string) || "",
            fpStatus: (data.fpStatus as string) || "",
            waterSource: (data.waterSource as string) || "",
            toiletFacility: (data.toiletFacility as string) || "",
        }

        addMember(newMember)
        toast.success(`${newMember.firstName} added to household.`)
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={isAddingHead ? "default" : "outline"} className={cn(isAddingHead ? "" : "w-full")}>
                    <Plus/>
                    {isAddingHead ? "Add Household Head" : "Add Member"}
                </Button>
            </DrawerTrigger>
            <Wizard 
                steps={steps} 
                onSubmit={handleSubmit} 
                onCancel={handleCancel}
                initialData={isAddingHead ? { relationship: "Head" } : undefined}
            >
                <DrawerContent className="!h-[92dvh] !max-h-[92dvh]">
                    <div ref={setContainer} className="flex flex-col h-full overflow-hidden">
                        <DrawerHeader className="p-0 border-b">
                            <div className="px-6 py-3">
                                <DrawerTitle>
                                    {isAddingHead ? "Add the Household Head" : "Add Household Member"}
                                </DrawerTitle>
                            </div>
                            <WizardProgress className="h-1 rounded-none border-none" />
                        </DrawerHeader>

                        <WizardContent />

                        <DrawerFooter className="p-0">
                            <WizardFooter />
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Wizard>
        </Drawer >
    )
}
