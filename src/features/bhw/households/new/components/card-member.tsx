import { Cake } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
    Frame,
    FrameFooter,
    FramePanel,
} from "@/components/reui/frame"

import { MemberCardControl } from "./card-member-controls"
import { formatAge } from "../options/classification"

interface CardMemberProps {
    fullName: string
    sex: "male" | "female"
    dateOfBirth: string
    ageGroup: string
    civilStatus: string
    religion: string
    education: string
    relationship: string
    onEdit?: () => void
    onDelete?: () => void
}

export function CardMember({
    fullName,
    sex,
    dateOfBirth,
    ageGroup,
    civilStatus,
    religion,
    education,
    relationship,
    onEdit,
    onDelete,
}: CardMemberProps) {
    const sexColor =
        sex === "female"
            ? "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
            : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"

    return (
        <Frame spacing="sm" className="w-full">
            <FramePanel className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <h1 className="font-heading font-semibold">{fullName}</h1>
                    <div className="flex items-center gap-2">
                        <Badge className={sexColor}>
                            {sex === "female" ? "Female" : "Male"}
                        </Badge>
                        <MemberCardControl memberName={fullName} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                </div>
                <span className="inline-flex items-center gap-1 text-muted-foreground truncate text-sm">
                    <Cake className="size-4" />
                    {dateOfBirth} • {formatAge(dateOfBirth)}
                </span>

                <div className="flex items-center flex-wrap gap-2">
                    {ageGroup && <Badge variant="outline">{ageGroup}</Badge>}
                    {civilStatus && <Badge variant="outline">{civilStatus}</Badge>}
                    {religion && <Badge variant="outline">{religion}</Badge>}
                    {education && <Badge variant="outline">{education}</Badge>}
                </div>
            </FramePanel>
            <FrameFooter className="flex flex-row justify-between items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground truncate">
                    {relationship}
                </span>
            </FrameFooter>
        </Frame>
    )
}

export function CardMemberDemo() {
    return (
        <CardMember
            fullName="Delos Santos, Jerome Mancia"
            sex="female"
            dateOfBirth="17 Dec 2004"
            ageGroup="Adult"
            civilStatus="Married"
            religion="Catholic"
            education="Student Undergrad"
            relationship="Head"
        />
    )
}
