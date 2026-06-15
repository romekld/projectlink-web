export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const membershipTypeOptions: SelectOption[] = [
  { value: "M", label: "Member", abbreviation: "M" },
  { value: "D", label: "Dependent", abbreviation: "D" },
  { value: "DC", label: "Direct Contributors", abbreviation: "DC" },
  { value: "IC", label: "Indirect Contributors", abbreviation: "IC" },
  { value: "U", label: "Unknown", abbreviation: "U" },
]
