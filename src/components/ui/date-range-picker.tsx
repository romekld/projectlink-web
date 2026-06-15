"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
    value: DateRange | undefined
    onChange: (date: DateRange | undefined) => void
    className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date-picker-range"
                    className="justify-start px-2.5 font-normal w-full"
                >
                    <CalendarIcon className="h-4 w-4" />
                    {value?.from ? (
                        value.to ? (
                            <>
                                {format(value.from, "LLL dd, y")} -{" "}
                                {format(value.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(value.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}
