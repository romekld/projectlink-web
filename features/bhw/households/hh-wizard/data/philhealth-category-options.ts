export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const philhealthCategoryOptions: SelectOption[] = [
  { value: "formal-economy", label: "Formal Economy" },
  { value: "informal-economy", label: "Informal Economy" },
  { value: "indigent-sponsored", label: "Indigent/Sponsored" },
  { value: "senior-citizen", label: "Senior Citizen" },
  { value: "other", label: "Other" },
]
