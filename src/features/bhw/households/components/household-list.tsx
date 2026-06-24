'use client'

import { HouseholdCard } from './household-card'
import type { HouseholdCardData } from './household-card'

const SAMPLE_HOUSEHOLDS: HouseholdCardData[] = [
  {
    id: "1",
    householdNumber: "202606-10026-0001",
    headName: "Dela Cruz Household",
    address: "Blk 4 Lot 44, Purok 1, Victoria Reyes",
    visitDate: "3 Jun 2026",
    memberCount: 5,
    memberInitials: ["J", "JR", "J"],
    syncStatus: "pending_sync",
    progressPercent: 33,
    progressLabel: "1/3 step",
  },
  {
    id: "2",
    householdNumber: "202606-10026-0002",
    headName: "Santos Household",
    address: "Blk 2 Lot 12, Purok 3, San Jose",
    visitDate: "1 Jun 2026",
    memberCount: 4,
    memberInitials: ["M", "A", "R"],
    syncStatus: "validated",
    progressPercent: 100,
    progressLabel: "3/3 step",
  },
  {
    id: "3",
    householdNumber: "202606-10026-0003",
    headName: "Garcia Household",
    address: "Blk 8 Lot 22, Purok 2, San Antonio",
    visitDate: "28 May 2026",
    memberCount: 3,
    memberInitials: ["L", "C"],
    syncStatus: "draft",
    progressPercent: 66,
    progressLabel: "2/3 step",
  },
  {
    id: "4",
    householdNumber: "202606-10026-0004",
    headName: "Reyes Household",
    address: "Blk 1 Lot 8, Purok 5, San Isidro",
    visitDate: "25 May 2026",
    memberCount: 6,
    memberInitials: ["P", "J", "M"],
    syncStatus: "pending_validation",
    progressPercent: 33,
    progressLabel: "1/3 step",
  },
  {
    id: "5",
    householdNumber: "202606-10026-0005",
    headName: "Flores Household",
    address: "Blk 3 Lot 15, Purok 4, San Miguel",
    visitDate: "20 May 2026",
    memberCount: 2,
    memberInitials: ["T", "E"],
    syncStatus: "returned",
    progressPercent: 66,
    progressLabel: "2/3 step",
  },
  {
    id: "6",
    householdNumber: "202606-10026-0006",
    headName: "Villar Household",
    address: "Blk 6 Lot 30, Purok 1, Victoria Reyes",
    visitDate: "18 May 2026",
    memberCount: 7,
    memberInitials: ["C", "N", "G"],
    syncStatus: "validated",
    progressPercent: 100,
    progressLabel: "3/3 step",
  },
]

export function HouseholdList() {
  return (
    <div className="flex items-center flex-col gap-4">
      {SAMPLE_HOUSEHOLDS.map((household) => (
        <HouseholdCard key={household.id} household={household} />
      ))}
    </div>
  )
}
