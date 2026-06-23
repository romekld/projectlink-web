"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

export function FieldDate() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Field>
      <FieldLabel>Date of Visit <span className="text-destructive">*</span>
        {/* make this dynamic base on the date
 */}
        <Badge className="ml-auto border border-green-700/50 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
          {/* 1st Quarter */}
          {/* 2nd Quarter */}
          {/* 3rd Quarter */}
          4th Quarter
        </Badge>
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
            {/* trigger today in the calendar */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDate(new Date())}
            >
              Today
            </Button>
          </ButtonGroup>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
      <FieldDescription>Select the date of your visit to the household.</FieldDescription>
    </Field>
  )
}