import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ToggleFilter({ className }: { className?: string }) {
    return (
        <ToggleGroup variant="outline" type="single" defaultValue="all" className={`flex-wrap ${className}`}>
            <ToggleGroupItem value="all" aria-label="Toggle all">
                All
            </ToggleGroupItem>
            <ToggleGroupItem value="male" aria-label="Toggle male">
                Male
            </ToggleGroupItem>
            <ToggleGroupItem value="female" aria-label="Toggle female">
                Female
            </ToggleGroupItem>
            <ToggleGroupItem value="oldest" aria-label="Toggle oldest">
                Oldest
            </ToggleGroupItem>
            <ToggleGroupItem value="newest" aria-label="Toggle newest">
                Newest
            </ToggleGroupItem>
            <ToggleGroupItem value="dummy1" aria-label="Toggle dummy1">
                Dummy1
            </ToggleGroupItem>
            <ToggleGroupItem value="dummy2" aria-label="Toggle dummy2">
                Dummy2
            </ToggleGroupItem>
        </ToggleGroup>
    )
}
