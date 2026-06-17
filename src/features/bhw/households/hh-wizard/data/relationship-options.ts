export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const relationshipOptions: SelectOption[] = [
  { value: "Head", label: "Head", abbreviation: "1" },
  { value: "Spouse", label: "Spouse", abbreviation: "2" },
  { value: "Son", label: "Son", abbreviation: "3" },
  { value: "Daughter", label: "Daughter", abbreviation: "4" },
  { value: "Other", label: "Other", abbreviation: "5" },
]
