"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemMedia,
} from "@/components/ui/item"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MoreHorizontal, User, Calendar } from "lucide-react"
import { useHouseholdWizard, HouseholdMember } from "@/lib/store/household-wizard"
import { autoSuggestClassification, classificationOptions } from "../data/classification"
import { Sex } from "../../data/schema"

interface MemberCardProps {
    member: HouseholdMember
    index: number
}

export function MemberCard({ member, index }: MemberCardProps) {
    const { deleteMember, setEditingMember, setEditingDrawerOpen } = useHouseholdWizard()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const handleDelete = () => {
        deleteMember(member.id)
        setIsDeleteDialogOpen(false)
    }

    const handleEdit = () => {
        setEditingMember(member.id)
        setEditingDrawerOpen(true)
    }

    const classificationCode = autoSuggestClassification(member.dateOfBirth, member.sex as Sex)
    const classification = classificationOptions.find(c => c.code === classificationCode)

    const relationship = member.relationshipToHhHead.includes('-') 
        ? member.relationshipToHhHead.split('-')[1] 
        : member.relationshipToHhHead === "1" ? "Head" : member.relationshipToHhHead

    return (
        <Item variant="outline" className="bg-card hover:bg-accent/50 transition-colors">
            <ItemMedia>
                <Avatar className="size-10 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {index + 1}
                    </AvatarFallback>
                </Avatar>
            </ItemMedia>
            
            <ItemContent>
                <div className="flex items-center gap-2 mb-0.5">
                    <ItemTitle className="text-base font-semibold">
                        {member.lastName}, {member.firstName} {member.middleName || ""}
                    </ItemTitle>
                    {classification && (
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">
                            {classification.label}
                        </Badge>
                    )}
                </div>
                <ItemDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1 font-medium text-primary">
                        <User className="size-3" />
                        {relationship}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1 rounded-full bg-muted-foreground/30" />
                        {member.sex === "M" ? "Male" : "Female"}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1 rounded-full bg-muted-foreground/30" />
                        {member.age} yrs old
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="size-1 rounded-full bg-muted-foreground/30" />
                        <Calendar className="size-3" />
                        {member.dateOfBirth}
                    </span>
                </ItemDescription>
            </ItemContent>

            <ItemActions className="ml-auto">
                <Button variant="ghost" size="icon" onClick={handleEdit} className="size-8">
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit</span>
                </Button>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Member</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove <span className="font-semibold text-foreground">{member.firstName} {member.lastName}</span> from the household? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete}>Delete Member</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </ItemActions>
        </Item>
    )
}

