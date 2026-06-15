export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const relationshipOptions: SelectOption[] = [
  { value: "1", label: "Head", abbreviation: "1" },
  { value: "2", label: "Spouse", abbreviation: "2" },
  { value: "3", label: "Son", abbreviation: "3" },
  { value: "4", label: "Daughter", abbreviation: "4" },
  { value: "5", label: "Others, specify relation", abbreviation: "5" },
]
