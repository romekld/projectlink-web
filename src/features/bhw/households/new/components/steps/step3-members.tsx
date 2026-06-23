"use client"

import { useState } from "react"
import { Header } from "../layout/header"
import { EmptyState } from "../empty"
import { DrawerAddMember } from "../drawer-add-member"
import { CardMember } from "../card-member"
import { useWizardStore } from "../../stores/wizard-store"

export function Step3MemberInfo() {
    const members = useWizardStore((s) => s.members)
    const deleteMember = useWizardStore((s) => s.deleteMember)
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

    const editingMember = editingMemberId
        ? members.find((m) => m.id === editingMemberId) ?? undefined
        : undefined

    return (
        <>
            <Header title="Step 3: Members" description="Enter information about the household members." />

            {members.length === 0 ? (
                <section className="p-6 flex flex-1 items-center justify-center">
                    <EmptyState />
                </section>
            ) : (
                <section className="p-6 flex flex-col gap-4 flex-1 items-center">
                    {members.map((member) => {
                        const fullName = `${member.lastName}, ${member.firstName}${member.middleName ? ` ${member.middleName}` : ""}`
                        return (
                            <CardMember
                                key={member.id}
                                fullName={fullName}
                                sex={member.sex}
                                dateOfBirth={member.dateOfBirth}
                                ageGroup={member.ageGroup}
                                civilStatus={member.civilStatus}
                                religion={member.religion}
                                education={member.education}
                                relationship={member.relationship}
                                onEdit={() => setEditingMemberId(member.id)}
                                onDelete={() => deleteMember(member.id)}
                            />
                        )
                    })}
                    <DrawerAddMember
                        triggerLabel="Add Another Member"
                        variant="outline"
                        buttonClassName="w-full"
                    />
                </section>
            )}

            {editingMember && (
                <DrawerAddMember
                    hideTrigger
                    editingMember={editingMember}
                    onClose={() => setEditingMemberId(null)}
                />
            )}
        </>
    )
}
