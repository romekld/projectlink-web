import { Search } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { FilterDrawer } from "./filter-drawer"

export function SearchBar({ className }: { className?: string }) {
    return (
        <div className={`flex gap-2 w-full ${className}`}>
            <InputGroup>
                <InputGroupInput placeholder="Search residents..." />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                {/* <InputGroupAddon align="inline-end">? results</InputGroupAddon> */}
            </InputGroup>
            <FilterDrawer />
        </div>
    )
}
