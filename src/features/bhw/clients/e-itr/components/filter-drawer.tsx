"use client"

import * as React from "react"
import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group"
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isSameDay
} from "date-fns"

import { Funnel } from 'lucide-react'
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export function FilterDrawer() {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    const [sortBy, setSortBy] = React.useState<string>("newest")

    const handleQuickSelect = (type: "today" | "week" | "month") => {
        const today = new Date()
        if (type === "today") {
            setDate({
                from: startOfDay(today),
                to: endOfDay(today),
            })
        } else if (type === "week") {
            setDate({
                from: startOfWeek(today, { weekStartsOn: 1 }),
                to: endOfWeek(today, { weekStartsOn: 1 }),
            })
        } else if (type === "month") {
            setDate({
                from: startOfMonth(today),
                to: endOfMonth(today),
            })
        }
    }

    const handleResetDates = () => {
        setDate(undefined)
    }

    const handleResetAll = () => {
        setDate(undefined)
        setSortBy("newest")
    }

    const today = new Date()
    const isTodayActive = date?.from && date?.to && isSameDay(date.from, startOfDay(today)) && isSameDay(date.to, endOfDay(today))
    const isWeekActive = date?.from && date?.to && isSameDay(date.from, startOfWeek(today, { weekStartsOn: 1 })) && isSameDay(date.to, endOfWeek(today, { weekStartsOn: 1 }))
    const isMonthActive = date?.from && date?.to && isSameDay(date.from, startOfMonth(today)) && isSameDay(date.to, endOfMonth(today))

    const activeCount = (date?.from ? 1 : 0) + (date?.to ? 1 : 0) + (sortBy !== "newest" ? 1 : 0)

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                    <Funnel />
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Filter by:
                    </DrawerTitle>
                </DrawerHeader>

                <div className="px-4 pb-4 flex flex-col gap-4">
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <div className="flex justify-between items-center w-full">
                                    <FieldLabel htmlFor="date-range">Created On</FieldLabel>
                                    <Button
                                        type="button"
                                        onClick={handleResetDates}
                                        variant="ghost"
                                        className="h-auto p-0 text-xs font-semibold"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <DateRangePicker value={date} onChange={setDate} />
                            </Field>
                            {/* Quick select options */}
                            <ButtonGroup className="w-full">
                                <Button
                                    variant={isTodayActive ? "default" : "outline"}
                                    type="button"
                                    onClick={() => handleQuickSelect("today")}
                                    className="flex-1"
                                >
                                    Today
                                </Button>
                                <Button
                                    variant={isWeekActive ? "default" : "outline"}
                                    type="button"
                                    onClick={() => handleQuickSelect("week")}
                                    className="flex-1"
                                >
                                    This Week
                                </Button>
                                <Button
                                    variant={isMonthActive ? "default" : "outline"}
                                    type="button"
                                    onClick={() => handleQuickSelect("month")}
                                    className="flex-1"
                                >
                                    This Month
                                </Button>
                            </ButtonGroup>
                        </FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="sort-by">Sort by</FieldLabel>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="newest">Newest to Oldest (Newest First)</SelectItem>
                                        <SelectItem value="oldest">Oldest to Newest (Oldest First)</SelectItem>
                                        <SelectItem value="az">Alphabetical (A - Z)</SelectItem>
                                        <SelectItem value="za">Alphabetical (Z - A)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldSet>
                </div>

                <DrawerFooter className="flex flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetAll}
                        className="flex-1"
                    >
                        Reset All
                    </Button>
                    <DrawerClose asChild>
                        <Button
                            type="button"
                            className="flex-1"
                        >
                            Apply Filters {activeCount > 0 ? <Badge variant="secondary" className="text-[10px] px-1 py-0">{activeCount}</Badge> : ""}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
