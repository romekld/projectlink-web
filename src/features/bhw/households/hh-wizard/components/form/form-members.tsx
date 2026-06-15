

import { FieldSeparator } from "@/components/ui/field";
import { EmptyMembers } from "../../components/empty";
import { MemberCard } from "../../components/member-card";
import { AddDrawerScrollable } from "../../components/add-drawer-scrollable"
import { useHouseholdWizard } from "@/lib/store/household-wizard";

export function MembersPage() {
    const { members } = useHouseholdWizard()

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">Household Members</h1>
                <p className="text-sm text-muted-foreground">
                    Please provide the basic information of the household members.
                </p>
            </div>
            <FieldSeparator />
            <div className="flex-1 flex flex-col justify-center items-center">
                {members.length === 0 ? (
                    <EmptyMembers />
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        <div className="space-y-4">
                            {members.map((member) => (
                                <MemberCard key={member.id} member={member} />
                            ))}
                        </div>
                        <AddDrawerScrollable />
                    </div>
                )}
            </div>
        </div>
    )
}
