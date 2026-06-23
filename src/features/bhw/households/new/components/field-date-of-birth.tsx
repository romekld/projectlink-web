"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Cake } from "lucide-react"

interface FieldDateOfBirthProps {
  value?: string
  onValueChange?: (value: string) => void
}

export function FieldDateOfBirth({ value, onValueChange }: FieldDateOfBirthProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  )

  const date = value !== undefined ? (value ? new Date(value) : undefined) : internalDate
  
  const handleSelect = (date: Date | undefined) => {
    setInternalDate(date)
    if (onValueChange && date) {
      onValueChange(date.toISOString().split("T")[0])
    }
    setOpen(false)
  }

  return (
    <Field>
      <FieldLabel htmlFor="date">Date of birth <span className="text-destructive">*</span></FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-start font-normal"
          >
            <Cake />
            {date
              ? date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            disabled={{ after: new Date() }}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
