import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card"

import { MapPin, Cake, ArrowRight } from "lucide-react"

export function ResidentCard() {
    return (
        // <Button
        //     asChild
        //     variant="ghost"
        //     className="hover:bg-transparent"
        //     // onClick={() => console.log("Card clicked!")}
        // >
        <Card size="sm" className="w-full border bg-muted dark:bg-card !p-[5px] !gap-0 rounded-xl">
            <div className="p-2 bg-background dark:bg-accent rounded-lg gap-2 flex flex-col w-full">
                <CardHeader className="p-0">
                    <CardAction>
                        {/* <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ">
                            Male
                        </Badge> */}
                        <Badge className="bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                            Female
                        </Badge>
                    </CardAction>
                    {/* <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <House className="size-4" />
                            </span>
                            <span className="font-mono text-sm text-muted-foreground">202606-10026-0001</span>
                        </span>
                        <BadgeStatus />
                    </div> */}
                    <CardTitle>
                        Delos Santos, Jerome Mancia
                    </CardTitle>
                    <CardDescription>
                        <span className="inline-flex items-center gap-1 text-muted-foreground truncate">
                            <Cake className="size-4 " />
                            17 Dec 2004 • 18 years old
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 ">
                    <div className="flex items-center flex-wrap gap-1">

                        <Badge variant="outline">
                            Married
                        </Badge>
                        <Badge variant="outline">
                            Catholic
                        </Badge>
                        <Badge variant="outline">
                            Student Undegrate
                        </Badge>

                    </div>
                </CardContent>
            </div>

            <CardFooter className="p-2 pb-1 bg-transparent border-none dark:bg-card w-full flex justify-between items-center gap-3">
                {/* <ProgressWithLabel /> */}

                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground truncate">
                    <MapPin className="size-3 " />
                    Blk 4 Lot 44, Purok 1, Victoria Reyes
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    Select
                    <ArrowRight className="size-3 " />
                </span>
            </CardFooter>
        </Card >
        // </Button >
    )
}


import { Progress } from "@/components/ui/progress"

export function ProgressWithLabel() {
    return (
        <Progress value={33} id="progress-upload" />
    )
}
import { Loader } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function BadgeStatus() {
    return (
        <Badge variant="outline" className="border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
            <Loader data-icon="inline-start" />
            Pending
        </Badge>
        // <Badge variant="outline" className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
        //   <CircleCheckBig  data-icon="inline-start" />
        //   Approved
        // </Badge>
    )
}

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
} from "@/components/ui/avatar"

export function MembersAvatar() {
    return (
        <AvatarGroup className="">
            <Avatar size="sm">
                <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
                <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
                <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
    )
}
