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
import { LucideIcon } from "lucide-react"
import { Item, ItemContent } from "@/components/ui/item"

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
  defaultValue?: string
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
  value,
  defaultValue,
  disabled = false,
  error,
  description,
  container,
}: ComboboxFieldProps) {
  const itemValues = React.useMemo(
    () => options.map((option) => option.value).filter(Boolean),
    [options]
  )

  const itemToLabel = React.useCallback(
    (itemValue: string) =>
      options.find((option) => option.value === itemValue)?.label ?? itemValue,
    [options]
  )

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Combobox
        items={itemValues}
        value={value ?? null}
        defaultValue={defaultValue ?? null}
        onValueChange={(selected: string | null) => onValueChange?.(selected ?? "")}
        itemToStringLabel={itemToLabel}
        disabled={disabled}
      >
        <ComboboxInput
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          showClear
          onFocus={(e) => e.currentTarget.select()}
        >
          {Icon ? (
            <InputGroupAddon align="inline-start">
              <Icon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          ) : null}
        </ComboboxInput>
        <ComboboxContent container={container}>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          <ComboboxList>
            {(itemValue: string) => {
              const option = options.find((entry) => entry.value === itemValue)
              if (!option) return null

              return (
                <ComboboxItem key={itemValue} value={itemValue}>
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
              )
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error ? <FieldError className="mt-1">{error}</FieldError> : null}
      {description && !error ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}
    </Field>
  )
}
