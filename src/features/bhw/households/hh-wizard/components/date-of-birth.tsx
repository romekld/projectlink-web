// "use client"

// import * as React from "react"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { Calendar } from "@/components/ui/calendar"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//     Field,
//     FieldLabel,
// } from "@/components/ui/field"
// import { Button } from "@/components/ui/button"

// interface DateOfBirthProps {
//     className?: string
//     onDateChange?: (dateString: string) => void
// }

// export function DateOfBirth({ className, onDateChange }: DateOfBirthProps) {
//     const [date, setDate] = React.useState<Date>()

//     const handleDateChange = (newDate: Date | undefined) => {
//         setDate(newDate)
//         if (newDate && onDateChange) {
//             onDateChange(newDate.toISOString().split('T')[0])
//         }
//     }

//     return (
//         <Field className={className}>
//             <FieldLabel htmlFor="date">Date of birth</FieldLabel>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <Button
//                         variant="outline"
//                         data-empty={!date}
//                         className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
//                     >
//                         {date ? format(date, "PPP") : <span>Select date</span>}
//                         <CalendarIcon />
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                         mode="single"
//                         selected={date}
//                         onSelect={handleDateChange}
//                         defaultMonth={date}
//                         disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
//                     />
//                 </PopoverContent>
//             </Popover>
//         </Field>
//     )
// }

"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateOfBirthProps {
    className?: string
    onDateChange?: (dateString: string) => void
    value?: string
    error?: string
    description?: string
}

export function DateOfBirth({ className, onDateChange, value, error, description }: DateOfBirthProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        value ? new Date(value) : undefined
    )

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        if (newDate && onDateChange) {
            onDateChange(newDate.toISOString().split('T')[0])
        }
        setOpen(false)
    }

    return (
        <Field data-invalid={!!error} className={className}>
            <FieldLabel htmlFor="date">Date of birth</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        data-empty={!date}
                        aria-invalid={!!error}
                        className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                        {date ? format(date, "PPP") : <span>Select date</span>}
                        <CalendarIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        defaultMonth={date}
                        captionLayout="dropdown"
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                </PopoverContent>
            </Popover>
            <FieldError>{error}</FieldError>
            {description && !error && (
                <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    )
}

