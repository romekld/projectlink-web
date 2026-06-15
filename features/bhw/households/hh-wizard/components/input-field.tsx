"use client"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { LucideIcon } from "lucide-react"
import * as React from "react"

interface InputFieldProps extends React.ComponentPropsWithoutRef<typeof Input> {
    label: string
    icon?: LucideIcon
    error?: string
    description?: string
    id: string
}

export function InputField({
    label,
    icon: Icon,
    error,
    description,
    id,
    className,
    ...props
}: InputFieldProps) {
    const InputComponent = Icon ? (
        <InputGroup>
            <InputGroupInput id={id} aria-invalid={!!error} {...props} />
            <InputGroupAddon align="inline-end">
                <Icon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
        </InputGroup>
    ) : (
        <Input id={id} aria-invalid={!!error} {...props} />
    )

    return (
        <Field data-invalid={!!error} className={className}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {InputComponent}
            <FieldError>{error}</FieldError>
            {description && !error && (
                <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    )
}
