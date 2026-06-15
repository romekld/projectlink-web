export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const civilStatusOptions: SelectOption[] = [
  { value: "married", label: "Married", abbreviation: "M" },
  { value: "single", label: "Single", abbreviation: "S" },
  { value: "widowed", label: "Widow/er", abbreviation: "W" },
  { value: "separated", label: "Separated", abbreviation: "SP" },
  { value: "cohabitation", label: "Cohabitation", abbreviation: "C" },
]
