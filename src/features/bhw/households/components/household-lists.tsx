"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { format } from "date-fns"
import type { Household, SyncStatus } from "../data/schema"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type HouseholdListsProps = {
  households: Household[]
  sortBy: "newest" | "oldest" | "az" | "za"
  onSortChange?: (val: "newest" | "oldest" | "az" | "za") => void
}

const statusConfig: Record<
  SyncStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  draft: {
    label: "Draft",
    bgClass: "bg-zinc-100 dark:bg-zinc-900",
    textClass: "text-zinc-700 dark:text-zinc-400",
  },
  pending_sync: {
    label: "Pending Sync",
    bgClass: "bg-amber-100 dark:bg-amber-950/30",
    textClass: "text-amber-700 dark:text-amber-400",
  },
  pending_validation: {
    label: "In Review",
    bgClass: "bg-blue-100 dark:bg-blue-950/30",
    textClass: "text-blue-700 dark:text-blue-400",
  },
  returned: {
    label: "Returned",
    bgClass: "bg-rose-100 dark:bg-rose-950/30",
    textClass: "text-rose-700 dark:text-rose-400",
  },
  validated: {
    label: "Synced",
    bgClass: "bg-emerald-100 dark:bg-emerald-950/30",
    textClass: "text-emerald-700 dark:text-emerald-400",
  },
}

const sortLabels = {
  newest: "Newest first",
  oldest: "Oldest first",
  az: "A to Z",
  za: "Z to A",
}

export function HouseholdLists({ households, sortBy, onSortChange }: HouseholdListsProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Header matching the image */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Households ({households.length})
        </span>
        {onSortChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {sortLabels[sortBy]}
                <ChevronRight className="size-3.5 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onSortChange("newest")}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("oldest")}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("az")}>
                A to Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("za")}>
                Z to A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* List Container Card matching the image */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {households.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Home className="size-8 stroke-[1.5] mb-2 opacity-50" />
            <p className="text-sm">No households found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {households.map((hh) => {
              const status = statusConfig[hh.syncStatus]
              const lastVisitDate = hh.visitDateQ1 || hh.lastUpdated

              let formattedDate = "No visit"
              if (lastVisitDate) {
                try {
                  formattedDate = format(new Date(lastVisitDate), "MMM d, yyyy")
                } catch {
                  formattedDate = lastVisitDate
                }
              }

              return (
                <Link
                  key={hh.id}
                  href={`/bhw/households/${hh.id}`}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/40 active:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle icon container with status color */}
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                        status.bgClass,
                        status.textClass
                      )}
                    >
                      <Home className="size-5" />
                    </div>

                    {/* Text details */}
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {hh.respondentLastName}, {hh.respondentFirstName}
                        </span>
                        {hh.nhtsStatus === "NHTS-4Ps" && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200 dark:border-emerald-900 rounded-md">
                            4Ps
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        HH #{hh.householdNumber} • {hh.members.length} {hh.members.length === 1 ? 'member' : 'members'}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1 text-[9px] py-0 px-1.5 font-normal rounded-md border-0 w-fit capitalize",
                          status.bgClass,
                          status.textClass
                        )}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Right side date & chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-foreground">
                      {formattedDate}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground/60" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
