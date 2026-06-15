"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ButtonGroup } from "@/components/ui/button-group"

interface DatePickerProps {
    date?: Date
    onDateChange: (date: Date | undefined) => void
    className?: string
    "aria-invalid"?: boolean
}

export function DatePicker({ date, onDateChange, className, "aria-invalid": ariaInvalid }: DatePickerProps) {
    return (
        <ButtonGroup className={cn("w-full", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!date}
                        aria-invalid={ariaInvalid}
                        className="flex-1 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                        mode="single" 
                        selected={date} 
                        onSelect={onDateChange}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        disabled={(date) => date > new Date()}
                    />
                </PopoverContent>
            </Popover>
            <Button 
                variant="outline" 
                onClick={() => onDateChange(new Date())}
                className="shrink-0 px-4"
            >
                Today
            </Button>
        </ButtonGroup>
    )
}
