"use client"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectOption {
    value: string
    label: string
    abbreviation?: string
}

interface SelectFieldProps {
    label: string
    placeholder: string
    options: SelectOption[]
    className?: string
    showAbbreviation?: boolean
    onValueChange?: (value: string) => void
    value?: string
    error?: string
    description?: string
}

export function SelectField({
    label,
    placeholder,
    options,
    className,
    showAbbreviation = true,
    onValueChange,
    value = "",
    error,
    description,
}: SelectFieldProps) {
    return (
        <Field data-invalid={!!error} className={className}>
            <FieldLabel htmlFor={label}>{label}</FieldLabel>
            <Select onValueChange={onValueChange} value={value}>
                <SelectTrigger className="w-full text-left" aria-invalid={!!error}>
                    <SelectValue placeholder={placeholder} className="truncate" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {showAbbreviation && option.abbreviation ? (
                                    <>
                                        <span className="font-medium">{option.abbreviation}</span><span className="text-muted-foreground"> — {option.label}
                                        </span>
                                    </>
                                ) : (
                                    option.label
                                )}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <FieldError>{error}</FieldError>
            {description && !error && (
                <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    )
}
