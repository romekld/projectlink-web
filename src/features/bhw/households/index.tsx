"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Household } from "./data/schema"

import { StatusTab } from "./components/status-tab"
// import { SearchBar } from "./components/search-bar"

type BhwHouseholdsPageProps = {
  households: Household[]
}

export function BhwHouseholdsPage({ households }: BhwHouseholdsPageProps) {
  return (
    <div className="flex flex-col gap-3 ">
 {/* px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16 */}
      <StatusTab />

    </div>
  )
}
