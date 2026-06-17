"use client"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { LucideIcon, Plus, Minus, } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

interface InputFieldProps extends React.ComponentPropsWithoutRef<typeof Input> {
    label: string
    icon?: LucideIcon
    error?: string
    description?: string
    id: string
}

export function NumberField({
    label,
    icon: Icon,
    error,
    description,
    id,
    className,
    value = 0,
    onChange,
    ...props
}: InputFieldProps) {
    const [localValue, setLocalValue] = React.useState(Number(value) || 0)

    const increment = () => {
        const newValue = localValue + 1
        setLocalValue(newValue)
        if (onChange) {
            onChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const decrement = () => {
        const newValue = Math.max(0, localValue - 1)
        setLocalValue(newValue)
        if (onChange) {
            onChange({ target: { value: newValue.toString() } } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    React.useEffect(() => {
        setLocalValue(Number(value) || 0)
    }, [value])

    const InputComponent = Icon ? (
        <InputGroup>
            <InputGroupInput
                id={id}
                aria-invalid={!!error}
                {...props}
                value={localValue.toString()}
                onChange={onChange}
                type="number"
            />
            <InputGroupAddon>
                <Icon />
            </InputGroupAddon>
        </InputGroup>
    ) : (
        <Input
            id={id}
            aria-invalid={!!error}
            {...props}
            className="text-center"
            value={localValue.toString()}
            onChange={onChange}
            type="number"
        />
    )

    return (
        <Field data-invalid={!!error} className={className}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>

            <ButtonGroup>

                <Button variant="outline" aria-label="Decrease" onClick={decrement}>
                    <Minus />
                </Button>
                {InputComponent}

                <Button variant="outline" aria-label="Increase" onClick={increment}>
                    <Plus />
                </Button>
            </ButtonGroup>
            <FieldError>{error}</FieldError>
            {description && !error && (
                <FieldDescription>{description}</FieldDescription>
            )}

        </Field>
    )
}
