import { ContactRound, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SearchBar } from "./components/search-bar"
import { ToggleFilter } from "./components/filter-toggle"
import { ResidentCard } from "./components/resident-card"

export function EITRPage() {
    return (
        <div className="flex flex-col h-dvh">
            {/* px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16 */}
            {/* fixed header */}
            <header className="shrink-0 flex flex-col">
                <div className="flex p-5 border-b shrink-0 items-center justify-between">
                    <h1 className="flex items-center gap-3 text-base font-semibold">
                        <ContactRound className="size-4" />
                        <span>Residents</span>
                    </h1>
                    <Button variant="outline" size="icon-lg">
                        <Plus />
                    </Button>
                </div>
                <div className="p-4 border-b flex flex-col shrink-0 items-center gap-4 items-start">
                    <SearchBar />
                    <ToggleFilter className="w-full" />
                </div>
            </header>
            {/* scrollable main content */}
            <main className="p-4 flex-1 overflow-auto">
                <div className="flex flex-col gap-4">
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                    <ResidentCard />
                </div>

                {/* <ResidentCard />
                <ResidentCard />
                <ResidentCard />
                <ResidentCard /> */}
                {/* <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
              **Tab content should be displayed here**
            </div> */}
            </main>
        </div >
    )
}