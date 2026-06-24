export interface SelectOption {
  value: string
  label: string
  code?: string
}

export const relationshipOptions: SelectOption[] = [
  { value: "Head", label: "Head", code: "1" },
  { value: "Spouse", label: "Spouse", code: "2" },
  { value: "Son", label: "Son", code: "3" },
  { value: "Daughter", label: "Daughter", code: "4" },
]
