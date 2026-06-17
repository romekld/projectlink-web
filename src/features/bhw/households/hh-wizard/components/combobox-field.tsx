"use client"

import * as React from "react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import { LucideIcon, ChevronDownIcon } from "lucide-react"
import {
  Item,
  ItemContent
} from "@/components/ui/item"

export interface ComboboxOption {
  value: string
  label: string
  abbreviation?: string
  description?: string
}

interface ComboboxFieldProps {
  label: string
  placeholder: string
  options: ComboboxOption[]
  icon?: LucideIcon
  className?: string
  showAbbreviation?: boolean
  onValueChange?: (value: string) => void
  value?: string
  disabled?: boolean
  error?: string
  description?: string
  container?: HTMLElement | null
}

export function ComboboxField({
  label,
  placeholder,
  options,
  icon: Icon,
  className,
  showAbbreviation = true,
  onValueChange,
  value = "",
  disabled = false,
  error,
  description,
  container,
}: ComboboxFieldProps) {
  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Combobox
        value={value}
        onValueChange={(val: string | null) => onValueChange?.(val || "")}
        items={options}
        defaultValue={options[0]?.value || ""}
      >
        <ComboboxInput
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          showClear
        >
          {Icon && (
            <InputGroupAddon align="inline-start">
              <Icon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          )}
          
        </ComboboxInput>
        <ComboboxContent container={container}>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          <ComboboxList>
            {(option: ComboboxOption) => (
              <ComboboxItem key={option.value} value={option.value}>
                {showAbbreviation && option.abbreviation ? (
                  <Item size="xs" className="p-0 bg-transparent hover:bg-transparent">
                    <ItemContent className="grid grid-cols-[max-content_1fr] !gap-2">
                      <div className="font-medium">{option.abbreviation}</div>
                      <div className="text-muted-foreground">{option.label}</div>
                    </ItemContent>
                  </Item>
                ) : (
                  <span>{option.label}</span>
                )}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError>{error}</FieldError>
      {description && !error && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  )
}
