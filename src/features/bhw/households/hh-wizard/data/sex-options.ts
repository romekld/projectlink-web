export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const sexOptions: SelectOption[] = [
  { value: "M", label: "Male", abbreviation: "M" },
  { value: "F", label: "Female", abbreviation: "F" },
]
