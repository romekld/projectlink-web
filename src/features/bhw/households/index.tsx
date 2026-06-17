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
import { Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusTab } from "./components/status-tab"
// import { SearchBar } from "./components/search-bar"

type BhwHouseholdsPageProps = {
  households: Household[]
}

export function BhwHouseholdsPage({ households }: BhwHouseholdsPageProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16 */}
      <header className="flex p-6 shrink-0 items-center justify-between border-b">
        <h1 className="flex items-center gap-4 font-heading font-medium text-xl">
          <Folder />
          <span>Households</span>
        </h1>
        <Button variant="outline" size="icon-lg">
          <Plus />
        </Button>
      </header>
      <main></main>
      <StatusTab />

    </div>
  )
}
