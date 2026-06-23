"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

interface FieldDateProps {
  value?: string
  onValueChange?: (value: string) => void
}

export function FieldDate({ value, onValueChange }: FieldDateProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  )

  const date = value !== undefined ? (value ? new Date(value) : undefined) : internalDate

  const handleSelect = (selected: Date | undefined) => {
    setInternalDate(selected)
    if (onValueChange && selected) {
      onValueChange(selected.toISOString().split("T")[0])
    }
  }

  const handleToday = () => {
    const today = new Date()
    setInternalDate(today)
    onValueChange?.(today.toISOString().split("T")[0])
  }

  const quarter = date
    ? `Q${Math.ceil((date.getMonth() + 1) / 3)}`
    : null

  return (
    <Field>
      <FieldLabel>Date of Visit <span className="text-destructive">*</span>
        {quarter && (
          <Badge className="ml-auto border border-green-700/50 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            {quarter === "Q1" && "1st Quarter"}
            {quarter === "Q2" && "2nd Quarter"}
            {quarter === "Q3" && "3rd Quarter"}
            {quarter === "Q4" && "4th Quarter"}
          </Badge>
        )}
      </FieldLabel>

      <Popover>
        <PopoverTrigger asChild>
          <ButtonGroup>
            <Button
              variant="outline"
              data-empty={!date}
              size="lg"
              className="justify-start text-left flex-1 data-[empty=true]:text-muted-foreground"
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => {
                e.preventDefault()
                handleToday()
              }}
            >
              Today
            </Button>
          </ButtonGroup>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
      <FieldDescription>Select the date of your visit to the household.</FieldDescription>
    </Field>
  )
}
