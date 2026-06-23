"use client"

import * as React from "react"
import { Lock, type LucideIcon } from "lucide-react"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

/**
 * A reusable form field input that composes Field, FieldLabel, Input/InputGroup,
 * FieldDescription, and FieldError. Works standalone or with react-hook-form Controller.
 *
 * @example
 * // With react-hook-form Controller
 * <Controller
 *   name="title"
 *   control={form.control}
 *   render={({ field, fieldState }) => (
 *     <FieldInput
 *       label={<>Title <Badge variant="secondary">Required</Badge></>}
 *       field={field}
 *       fieldState={fieldState}
 *       startIcon={Search}
 *       description="Enter a title"
 *     />
 *   )}
 * />
 *
 * @example
 * // Standalone (without react-hook-form)
 * <FieldInput
 *   label="Email"
 *   id="email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error="Invalid email address"
 * />
 */
interface FieldInputProps extends Omit<React.ComponentProps<typeof Input>, "ref"> {
  label: React.ReactNode
  field?: {
    onChange: (...event: unknown[]) => void
    onBlur: (...event: unknown[]) => void
    value: string | number | readonly string[] | undefined
    name: string
    ref: React.RefCallback<HTMLInputElement>
  }
  fieldState?: {
    invalid: boolean
    error?: { message?: string }
  }
  startIcon?: LucideIcon
  endIcon?: LucideIcon
  description?: React.ReactNode
  error?: string
  requiredTag?: boolean
}

export function FieldInput({
  label,
  id,
  field,
  fieldState,
  startIcon: StartIcon,
  endIcon: EndIcon,
  description,
  error,
  className,
  readOnly,
  disabled,
  requiredTag,
  ...props
}: FieldInputProps) {
  const hasAddons = StartIcon || EndIcon || readOnly
  const inputId = id ?? field?.name
  const isInvalid = fieldState?.invalid ?? !!error
  const errorMessages = fieldState?.error ? [fieldState.error] : undefined

  const inputElement = hasAddons ? (
    <InputGroup>
      {StartIcon && (
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <StartIcon />
          </InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        id={inputId}
        aria-invalid={isInvalid}
        readOnly={readOnly}
        disabled={disabled}
        {...field}
        {...props}
      />
      {(EndIcon || readOnly) && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            {readOnly ? <Lock /> : EndIcon && <EndIcon />}
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  ) : (
    <Input
      id={inputId}
      aria-invalid={isInvalid}
      readOnly={readOnly}
      disabled={disabled}
      {...field}
      {...props}
    />
  )

  return (
    <Field data-invalid={isInvalid} data-disabled={disabled || undefined} className={className}>
      <FieldLabel htmlFor={inputId}>{label}{requiredTag && <span className="text-destructive">*</span>}</FieldLabel>
      {inputElement}
      {isInvalid && (
        <FieldError errors={errorMessages}>{!errorMessages && error}</FieldError>
      )}
      {description && !isInvalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  )
}
