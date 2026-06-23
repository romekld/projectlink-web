import { ArrowLeft, X, } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SearchBar } from "./components/search-bar"
import { ToggleFilter } from "./components/filter-toggle"
import { ResidentCard } from "./components/resident-card"
import { Step1Search } from "./components/steps/step1-search"
import { Step2Triage } from "./components/steps/step2-triage"
import { Step3TriageLogging } from "./components/steps/step3-triage-logging"

export function ITRPage() {
    return (
        // <div className="flex flex-col h-dvh">
        //     {/* px-4 md:px-10 lg:px-16 py-4 md:py-10 lg:py-16 */}
        //     {/* fixed header */}
        //     <header className="shrink-0 flex flex-col">
        //         <div className="flex p-5 border-b shrink-0 items-center justify-between">
        //             <h1 className="flex items-center gap-3 text-base font-semibold">
        //                 <ContactRound className="size-4" />
        //                 <span>Residents</span>
        //             </h1>
        //             <Button variant="outline" size="icon-lg">
        //                 <Plus />
        //             </Button>
        //         </div>
        //         <div className="p-4 border-b flex flex-col shrink-0 items-center gap-4 items-start">
        //             <SearchBar />
        //             <ToggleFilter className="w-full" />
        //         </div>
        //     </header>
        //     {/* scrollable main content */}
        //     <main className="p-4 flex-1 overflow-auto">
        //         <div className="flex flex-col gap-4">
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //             <ResidentCard />
        //         </div>

        //         {/* <ResidentCard />
        //         <ResidentCard />
        //         <ResidentCard />
        //         <ResidentCard /> */}
        //         {/* <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
        //       **Tab content should be displayed here**
        //     </div> */}
        //     </main>
        // </div >

        <div className="flex h-dvh flex-col bg-background">
            {/* Fixed Header */}
            <header className="flex flex-col shrink-0 items-center justify-between border-b px-2 py-2">
                <nav className="flex items-center justify-between gap-4 w-full">
                    <Button variant="ghost" size="icon" className="size-10" >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <h1 className="text-base font-semibold">New E-ITR</h1>
                    <Button variant="ghost" size="icon" className="size-10" >
                        <X className="size-5" />
                    </Button>
                </nav>
            </header>

            {/* Main Content with ScrollArea */}
            <main className="h-full flex-1 flex flex-col overflow-y-auto">
                <Step1Search />
                {/* <Step2Triage /> */}
                {/* <Step3TriageLogging /> */}
            </main>

            {/* Fixed Bottom Bar */}
            <footer className="shrink-0 border-t bg-background">
                <Progress value={66} />
                <div className="flex items-center justify-between py-4 px-6">
                    <span className="text-sm font-semibold">Step of 3</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="lg">
                            Previous
                        </Button>
                        <Button className="px-8" size="lg">
                            Next
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}