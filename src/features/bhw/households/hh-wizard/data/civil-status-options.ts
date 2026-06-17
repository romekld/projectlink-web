export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const civilStatusOptions: SelectOption[] = [
  { value: "Single", label: "Single", abbreviation: "S" },
  { value: "Married", label: "Married", abbreviation: "M" },
  { value: "Widowed", label: "Widow/er", abbreviation: "W" },
  { value: "Separated", label: "Separated", abbreviation: "SP" },
  { value: "Cohabitation", label: "Cohabitation", abbreviation: "C" },
]
