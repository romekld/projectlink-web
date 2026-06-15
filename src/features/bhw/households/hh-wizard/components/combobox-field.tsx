"use client"

import * as React from "react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import { LucideIcon } from "lucide-react"
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
  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  )

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Combobox
        value={selectedOption}
        onValueChange={(val: ComboboxOption | null) => onValueChange?.(val?.value || "")}
        items={options}
        getItemText={(item) => item.label}
      >
        <ComboboxInput
          placeholder={placeholder}
          disabled={disabled}
          showClear
          aria-invalid={!!error}
          
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
            <ComboboxCollection>
              {(option: ComboboxOption) => (
                <ComboboxItem key={option.value} value={option}>
                  {/* <div className="flex flex-col">
                    <div className="flex items-center">
                      {showAbbreviation && option.abbreviation ? (
                        <>
                          <span className="font-medium">{option.abbreviation}</span>
                          <span className="text-muted-foreground"> — {option.label}</span>
                        </>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </div>
                    {option.description && (
                      <span className="text-xs text-muted-foreground leading-tight">
                        {option.description}
                      </span>
                    )}
                  </div> */}
                  {showAbbreviation && option.abbreviation ? (
                    <Item size="xs" className="p-0">
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
            </ComboboxCollection>
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
