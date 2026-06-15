export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const sexOptions: SelectOption[] = [
  { value: "male", label: "Male", abbreviation: "M" },
  { value: "female", label: "Female", abbreviation: "F" },
]
