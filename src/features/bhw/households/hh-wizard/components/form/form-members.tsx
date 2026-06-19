

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { EmptyMembers } from "../../components/empty";
import { MemberCard } from "../../components/member-card";
import { AddDrawerScrollable } from "../../components/add-drawer-scrollable"
import { CompleteHouseholdValues } from "../../data/form-schema";
import { save_household_action } from "../../actions/hh-wizard-actions";
import { useHouseholdWizard, HouseholdData } from "@/lib/store/household-wizard"

export function MembersPage() {
    const { members, householdData, resetWizard } = useHouseholdWizard()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSaveHousehold = async () => {
        try {
            setIsSubmitting(true)
            const result = await save_household_action({
                household: householdData as CompleteHouseholdValues["household"],
                members: members as unknown as CompleteHouseholdValues["members"],
            })

            if (result?.data?.success) {
                toast.success("Household profile saved successfully!")
                resetWizard()
                // navigation logic here
            } else {
                toast.error("Failed to save household", {
                    description: result?.data?.error || "Unknown error",
                })
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <header className="p-5 border-b">
                <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Household Members</h1>
                <p className="text-sm text-muted-foreground">
                    Please provide the basic information of the household members.
                </p>
            </header>
            <div className="flex-1 flex flex-col justify-center items-center p-5">
                {members.length === 0 ? (
                    <EmptyMembers />
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <MemberCard key={member.id} member={member} index={index} />
                            ))}
                        </div>
                        <AddDrawerScrollable />

                        <Button
                            className="w-full mt-4"
                            onClick={handleSaveHousehold}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Household Profile"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
