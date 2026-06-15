import { Search } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

export function SearchBar({ className }: { className?: string }) {
    return (
        <InputGroup className={className}>
            <InputGroupInput placeholder="Search household" />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">? results</InputGroupAddon>
        </InputGroup>
    )
}
