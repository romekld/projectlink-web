import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "./search-bar"
import { FilterDrawer } from "./filter-drawer"
import { HouseholdList } from "./household-list"
// import { ReviewForm } from "../hh-wizard/components/form/form-review"

export function StatusTab() {
    return (
        <Tabs defaultValue="pending" >
            <TabsList variant="line" className="w-full">
                <TabsTrigger value="pending">
                    Pending <Badge className="text-[10px] px-1">25</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved">
                    Approved <Badge variant="secondary" className="text-[10px] px-1">1</Badge>
                </TabsTrigger>
                <TabsTrigger value="all">
                    All <Badge variant="secondary" className="text-[10px] px-1">5</Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="flex flex-col gap-3">
                <div className="flex gap-2 w-full">
                    <SearchBar className="flex-1" />
                    <FilterDrawer />
                </div>
                {/* <ReviewForm /> */}
                <HouseholdList />
            </TabsContent>
        </Tabs>
    )
}
