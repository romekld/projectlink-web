"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar } from "./avatar"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Calendar, User } from "lucide-react"
import { useHouseholdWizard, HouseholdMember } from "@/lib/store/household-wizard"
import { autoSuggestClassification, classificationOptions } from "../data/classification"
import { Sex } from "../../data/schema"

interface MemberCardProps {
    member: HouseholdMember
}

export function MemberCard({ member }: MemberCardProps) {
    const { deleteMember } = useHouseholdWizard()

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
            deleteMember(member.id)
        }
    }

    const handleEdit = () => {
        // TODO: Implement edit functionality
        console.log("Edit member:", member.id)
    }

    const classificationCode = autoSuggestClassification(member.dateOfBirth, member.sex as Sex)
    const classification = classificationOptions.find(c => c.code === classificationCode)

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
                <div className="flex flex-row items-start gap-4">
                    <Avatar />
                    <div className="grid gap-0.5">
                        <CardTitle className="text-lg leading-tight">
                            {member.lastName}, {member.firstName} {member.middleName || ""}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <span className="font-medium text-primary">
                                {member.relationshipToHhHead.split('-')[1] || member.relationshipToHhHead}
                            </span>
                            <span>•</span>
                            <span>{member.sex === "M" ? "Male" : "Female"}</span>
                            <span>•</span>
                            <span>{member.age} yrs old</span>
                        </CardDescription>
                    </div>
                </div>
                {classification && (
                    <Badge variant="secondary" className="shrink-0">
                        {classification.label}
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        <span>Born {member.dateOfBirth}</span>
                    </div>
                    {member.philhealthId && (
                        <div className="flex items-center gap-1.5">
                            <User className="size-3.5" />
                            <span>Philhealth: {member.philhealthId}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
                <Button variant="outline" size="sm" onClick={handleEdit} className="h-8">
                    <Pencil data-icon="inline-start" />
                    Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete} className="h-8 text-destructive hover:text-destructive">
                    <Trash2 data-icon="inline-start" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

