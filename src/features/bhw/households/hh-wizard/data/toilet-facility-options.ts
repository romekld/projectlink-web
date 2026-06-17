export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
  category?: "sanitary" | "unsanitary"
}

export const toiletFacilityOptions: SelectOption[] = [
  { value: "Sanitary-Septic", label: "Pour/flush connected to septic tank", abbreviation: "P", category: "sanitary" },
  { value: "Sanitary-VIP", label: "VIP or composting toilet", abbreviation: "VIP", category: "sanitary" },
  { value: "Unsanitary-Open", label: "Open drain/latrine", abbreviation: "OP", category: "unsanitary" },
  { value: "None", label: "Without toilet", abbreviation: "WO", category: "unsanitary" },
]
