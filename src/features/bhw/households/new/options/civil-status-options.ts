export interface SelectOption {
  value: string
  label: string
  code?: string
}

export const civilStatusOptions: SelectOption[] = [
  { value: "Single", label: "Single", code: "S" },
  { value: "Married", label: "Married", code: "M" },
  { value: "Widowed", label: "Widow/er", code: "W" },
  { value: "Separated", label: "Separated", code: "SP" },
  { value: "Cohabitation", label: "Cohabitation", code: "C" },
]
