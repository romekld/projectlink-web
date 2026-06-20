import { SearchBar } from "../search-bar"
import { ToggleFilter } from "../filter-toggle"
import { ResidentCard } from "../resident-card"
import { Header } from "../layout/header"

export function Step1Search() {
    return (
        <>
            {/* Step 1: Basic Information */}
            <Header title="Step 1: Basic Information" description="Search for the resident using their name." />

            <section className="sticky p-4 border-b flex flex-col shrink-0 gap-4 items-start">
                <SearchBar />
                <ToggleFilter className="w-full" />
            </section>

            <section className="p-4 flex flex-col gap-4">
                <ResidentCard />
                <ResidentCard />
                <ResidentCard />
                <ResidentCard />
                <ResidentCard />
            </section>
        </>
    )
}