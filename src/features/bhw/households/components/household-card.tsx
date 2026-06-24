import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { CalendarSearch, CircleCheckBig, House, Loader } from "lucide-react"

import type { SyncStatus } from "../data/schema"

export interface HouseholdCardData {
  id: string
  householdNumber: string
  headName: string
  address: string
  visitDate: string
  memberCount: number
  memberInitials: string[]
  syncStatus: SyncStatus
  progressPercent: number
  progressLabel: string
}

type HouseholdCardProps = {
  household: HouseholdCardData
}

export function HouseholdCard({ household }: HouseholdCardProps) {
  return (
    <Card size="sm" className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-2 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <House className="size-4" />
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {household.householdNumber}
            </span>
          </span>
          <BadgeStatus status={household.syncStatus} />
        </div>
        <CardTitle className="!text-lg">{household.headName}</CardTitle>
        <CardDescription>{household.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CalendarSearch className="size-4 text-sm text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">
              {household.visitDate}
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {household.memberCount} members
            </span>
            <MembersAvatar initials={household.memberInitials} />
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <ProgressWithLabel
          percent={household.progressPercent}
          label={household.progressLabel}
        />
      </CardFooter>
    </Card>
  )
}

type BadgeStatusProps = {
  status: SyncStatus
}

function BadgeStatus({ status }: BadgeStatusProps) {
  if (status === "validated") {
    return (
      <Badge
        variant="outline"
        className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
      >
        <CircleCheckBig data-icon="inline-start" />
        Approved
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
    >
      <Loader data-icon="inline-start" />
      Pending
    </Badge>
  )
}

type ProgressWithLabelProps = {
  percent: number
  label: string
}

function ProgressWithLabel({ percent, label }: ProgressWithLabelProps) {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>{percent}%</span>
        <span className="ml-auto text-muted-foreground text-sm">{label}</span>
      </FieldLabel>
      <Progress value={percent} id="progress-upload" />
    </Field>
  )
}

type MembersAvatarProps = {
  initials: string[]
}

function MembersAvatar({ initials }: MembersAvatarProps) {
  const visible = initials.slice(0, 3)
  const excess = Math.max(0, initials.length - 3)

  return (
    <AvatarGroup>
      {visible.map((initial, index) => (
        <Avatar key={`${initial}-${index}`} size="sm">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      ))}
      {excess > 0 && <AvatarGroupCount>+{excess}</AvatarGroupCount>}
    </AvatarGroup>
  )
}
