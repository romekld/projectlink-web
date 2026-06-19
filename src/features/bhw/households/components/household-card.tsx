import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { House, CalendarSearch } from "lucide-react"

export function HouseholdCard() {
  return (
    <Card size="sm" className="w-full ">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-2 text-sm">
            {/* Icon Container Wrapper */}
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <House className="size-4" />
            </span>
            <span className="font-mono text-sm text-muted-foreground">202606-10026-0001</span>
          </span>
          <BadgeStatus />
        </div>
        <CardTitle className="!text-lg">
          Dela Cruz Household
        </CardTitle>
        <CardDescription>
          Blk 4 Lot 44, Purok 1, Victoria Reyes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <CalendarSearch className="size-4 text-sm text-muted-foreground" />
            <span className="font-mono text-sm text-muted-foreground">3 Jun 2026</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">5 members</span>
            <MembersAvatar />
          </span>
        </div>
      </CardContent>
      <CardFooter >
        <ProgressWithLabel />
      </CardFooter>
    </Card >
  )
}


import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

export function ProgressWithLabel() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>33%</span>
        <span className="ml-auto text-muted-foreground text-sm">1/3 step</span>
      </FieldLabel>
      <Progress value={33} id="progress-upload" />
    </Field>
  )
}
import { Loader, CircleCheckBig } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeStatus() {
  return (
    <Badge variant="outline" className="border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
      <Loader data-icon="inline-start" />
      Pending
    </Badge>
    // <Badge variant="outline" className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
    //   <CircleCheckBig  data-icon="inline-start" />
    //   Approved
    // </Badge>
  )
}

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarGroupCount,
} from "@/components/ui/avatar"

export function MembersAvatar() {
  return (
    <AvatarGroup className="">
      <Avatar size="sm">
        <AvatarFallback>J</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>JR</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>J</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  )
}
