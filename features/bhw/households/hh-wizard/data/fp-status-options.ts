export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const fpStatusOptions: SelectOption[] = [
  { value: "na", label: "New Acceptor", abbreviation: "NA" },
  { value: "cu", label: "Current User", abbreviation: "CU" },
  { value: "cm", label: "Changing Method", abbreviation: "CM" },
  { value: "cc", label: "Changing Clinic", abbreviation: "CC" },
  { value: "do", label: "Dropout", abbreviation: "DO" },
  { value: "r", label: "Restarter", abbreviation: "R" },
  { value: "lv", label: "Lv", abbreviation: "Lv" },
]
