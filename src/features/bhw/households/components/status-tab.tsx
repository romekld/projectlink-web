import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HouseholdList } from "./household-list"
// import { ReviewForm } from "../hh-wizard/components/form/form-review"

export function StatusTab() {
    return (
        <Tabs defaultValue="all" className="flex flex-col gap-4 w-full">
            <TabsList className="w-full">
                <TabsTrigger value="all">
                    All (1)
                    {/* <Badge variant="secondary" className="text-[10px] px-1">5</Badge> */}
                </TabsTrigger>
                <TabsTrigger value="pending">
                    Pending (1)
                    {/* <Badge className="text-[10px] px-1">25</Badge> */}
                </TabsTrigger>
                <TabsTrigger value="approved">
                    Approved (1)
                    {/* <Badge variant="secondary" className="text-[10px] px-1">1</Badge> */}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all">

                {/* <ReviewForm /> */}
                <HouseholdList />
                **Tab content current setup**
            </TabsContent>
        </Tabs>
    )
}
