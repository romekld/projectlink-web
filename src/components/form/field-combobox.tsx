"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { InputGroupAddon } from "@/components/ui/input-group"
import {
  Combobox as ComboboxRoot,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxCollection,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from "@/components/ui/combobox"

type ComboboxOption = {
  value: string
  label: string
  abbreviation?: string
  description?: string
}

type FieldComboboxItem = string | ComboboxOption

interface FieldComboboxProps {
  label: React.ReactNode
  items: FieldComboboxItem[]
  placeholder?: string
  field?: {
    onChange: (...event: unknown[]) => void
    onBlur: (...event: unknown[]) => void
    value: string | string[] | null
    name: string
    ref: React.RefCallback<HTMLInputElement>
  }
  fieldState?: {
    invalid: boolean
    error?: { message?: string }
  }
  icon?: LucideIcon
  description?: React.ReactNode
  error?: string
  className?: string
  showClear?: boolean
  autoHighlight?: boolean
  disabled?: boolean
  container?: HTMLElement | null
  multiple?: boolean
  value?: string | string[] | null
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[] | null) => void
  renderItem?: (option: ComboboxOption) => React.ReactNode
  groups?: { label: string; items: FieldComboboxItem[] }[]
}

/**
 * A reusable form field combobox that composes Field, FieldLabel, Combobox,
 * FieldDescription, and FieldError. Works standalone or with react-hook-form Controller.
 *
 * @example
 * // With react-hook-form Controller (single-select)
 * <Controller
 *   name="framework"
 *   control={form.control}
 *   render={({ field, fieldState }) => (
 *     <FieldCombobox
 *       label="Framework"
 *       items={["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro"]}
 *       field={field}
 *       fieldState={fieldState}
 *     />
 *   )}
 * />
 *
 * @example
 * // Standalone with objects and groups
 * <FieldCombobox
 *   label="Framework"
 *   items={frameworks}
 *   placeholder="Select a framework"
 *   value={selected}
 *   onValueChange={setSelected}
 *   groups={[
 *     { label: "Meta-frameworks", items: ["Next.js", "Nuxt"] },
 *     { label: "Tools", items: ["Vite", "Turbopack"] },
 *   ]}
 *   renderItem={(opt) => <span className="font-medium">{opt.label}</span>}
 * />
 */
export function FieldCombobox({
  label,
  items,
  placeholder,
  field,
  fieldState,
  icon: Icon,
  description,
  error,
  className,
  showClear = true,
  autoHighlight = false,
  disabled = false,
  container,
  multiple = false,
  value: controlledValue,
  defaultValue,
  onValueChange,
  renderItem,
  groups,
}: FieldComboboxProps) {
  const normalize = React.useCallback(
    (raw: FieldComboboxItem[]): ComboboxOption[] =>
      raw.map((item) =>
        typeof item === "string" ? { value: item, label: item } : item,
      ),
    [],
  )

  const allOptions = React.useMemo(() => {
    if (groups?.length) {
      return groups.flatMap((g) => normalize(g.items))
    }
    return normalize(items)
  }, [groups, items, normalize])

  const groupedOptions = React.useMemo(() => {
    if (!groups?.length) return null
    return groups.map((g) => ({ label: g.label, items: normalize(g.items) }))
  }, [groups, normalize])

  const comboboxValue = React.useMemo(() => {
    const resolved = field?.value ?? controlledValue ?? (multiple ? [] : null)
    if (resolved == null) return multiple ? [] : null
    if (multiple) {
      const vals = resolved as string[]
      return allOptions.filter((opt) => vals.includes(opt.value))
    }
    return allOptions.find((opt) => opt.value === (resolved as string)) ?? null
  }, [allOptions, field?.value, controlledValue, multiple])

  const resolvedDefaultValue = React.useMemo(() => {
    if (defaultValue == null) return undefined
    if (multiple) {
      const vals = defaultValue as string[]
      return allOptions.filter((opt) => vals.includes(opt.value))
    }
    return allOptions.find((opt) => opt.value === (defaultValue as string)) ?? null
  }, [allOptions, defaultValue, multiple])

  const handleValueChange = React.useCallback(
    (nextValue: ComboboxOption | ComboboxOption[] | null) => {
      let next: string | string[] | null
      if (multiple) {
        next = (nextValue as ComboboxOption[]).map((opt) => opt.value)
      } else {
        next = (nextValue as ComboboxOption | null)?.value ?? null
      }
      field?.onChange?.(next)
      onValueChange?.(next)
    },
    [multiple, field, onValueChange],
  )

  const itemToStringValue = React.useCallback(
    (option: ComboboxOption) => option.label,
    [],
  )

  const defaultRenderItem = React.useCallback(
    (option: ComboboxOption) => (renderItem ? renderItem(option) : option.label),
    [renderItem],
  )

  const isInvalid = fieldState?.invalid ?? !!error
  const errorMessages = fieldState?.error ? [fieldState.error] : undefined

  const inputBlur = field?.onBlur
  const inputName = field?.name
  const inputRef = field?.ref as React.Ref<HTMLInputElement> | undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootValue = comboboxValue as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootDefaultValue = resolvedDefaultValue as any

  const contentList = groupedOptions ? (
    <ComboboxList>
      {groupedOptions.map((group, i) => (
        <React.Fragment key={group.label}>
          {i > 0 && <ComboboxSeparator />}
          <ComboboxGroup>
            <ComboboxLabel>{group.label}</ComboboxLabel>
            <ComboboxCollection>
              {(item: ComboboxOption) => (
                <ComboboxItem key={item.value} value={item}>
                  {defaultRenderItem(item)}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxGroup>
        </React.Fragment>
      ))}
    </ComboboxList>
  ) : (
    <ComboboxList>
      {(item: ComboboxOption) => (
        <ComboboxItem key={item.value} value={item}>
          {defaultRenderItem(item)}
        </ComboboxItem>
      )}
    </ComboboxList>
  )

  return (
    <Field data-invalid={isInvalid} data-disabled={disabled || undefined} className={className}>
      <FieldLabel>{label}</FieldLabel>
      <ComboboxRoot
        items={allOptions}
        value={rootValue}
        defaultValue={rootDefaultValue}
        onValueChange={handleValueChange}
        itemToStringValue={itemToStringValue}
        disabled={disabled}
        autoHighlight={autoHighlight}
      >
        {multiple ? (
          <ComboboxChips>
            <ComboboxValue>
              {(comboboxValue as ComboboxOption[]).map((opt) => (
                <ComboboxChip key={opt.value}>{opt.label}</ComboboxChip>
              ))}
            </ComboboxValue>
            <ComboboxChipsInput
              placeholder={placeholder}
              disabled={disabled}
              name={inputName}
              onBlur={inputBlur}
              ref={inputRef}
            />
          </ComboboxChips>
        ) : (
          <ComboboxInput
            placeholder={placeholder}
            disabled={disabled}
            showClear={showClear}
            aria-invalid={isInvalid}
            name={inputName}
            onBlur={inputBlur}
            ref={inputRef}
          >
            {Icon && (
              <InputGroupAddon align="inline-start">
                <Icon />
              </InputGroupAddon>
            )}
          </ComboboxInput>
        )}
        <ComboboxContent container={container}>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          {contentList}
        </ComboboxContent>
      </ComboboxRoot>
      {isInvalid && (
        <FieldError errors={errorMessages}>{!errorMessages && error}</FieldError>
      )}
      {description && !isInvalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  )
}
