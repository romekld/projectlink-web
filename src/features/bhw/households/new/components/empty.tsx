"use client"

import { PlusIcon } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { DrawerAddMember } from "./drawer-add-member"
import type { MemberFormValues } from "../schemas/household-form-schema"

interface EmptyStateProps {
  onAddMember: (data: MemberFormValues) => void
  householdIs4ps?: boolean
  householdIs4psId?: string
  householdIsIndigenous?: boolean
}

export function EmptyState({ onAddMember, householdIs4ps, householdIs4psId, householdIsIndigenous }: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PlusIcon />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">
          No Household Members
        </EmptyTitle>
        <EmptyDescription>
          Start by adding the first member of this household.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <DrawerAddMember
          onSave={onAddMember}
          householdIs4ps={householdIs4ps}
          householdIs4psId={householdIs4psId}
          householdIsIndigenous={householdIsIndigenous}
        />
      </EmptyContent>
    </Empty>
  )
}
