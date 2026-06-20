"use client"

import type { Household } from "./data/schema"
import { Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusTab } from "./components/status-tab"
import { SearchBar } from "./components/search-bar"

type BhwHouseholdsPageProps = {
  households: Household[]
}

export function BhwHouseholdsPage({ }: BhwHouseholdsPageProps) {
  return (
    <div className="flex flex-col h-dvh">
      {/* px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16 */}
      <header className="flex flex-col">
        <div className="flex p-5 border-b shrink-0 items-center justify-between">
          <h1 className="flex items-center gap-3 text-base font-semibold">
            <Folder className="size-4" />
            <span>Households</span>
          </h1>
          <Button variant="outline" size="icon-lg">
            <Plus />
          </Button>
        </div>
      </header>
      <main className="flex flex-col gap-4 flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col shrink-0 items-center gap-4">
          <SearchBar />
          <StatusTab />
        </div>
        {/* <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
          **Tab content should be displayed here**
        </div> */}
      </main>

    </div >
  )
}
