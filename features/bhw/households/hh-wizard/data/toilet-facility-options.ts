export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
  category?: "sanitary" | "unsanitary"
}

export const toiletFacilityOptions: SelectOption[] = [
  { value: "p", label: "Pour/flush toilet connected to septic tank", abbreviation: "P", category: "sanitary" },
  { value: "pf", label: "Pour/flush toilet connected to septic tank and to sewerage system", abbreviation: "PF", category: "sanitary" },
  { value: "vip", label: "Ventilated improved pit latrine (VIP) or composting toilet", abbreviation: "VIP", category: "sanitary" },
  { value: "ws", label: "Water-sealed connected to open drain", abbreviation: "WS", category: "unsanitary" },
  { value: "oh", label: "Overhung Latrine", abbreviation: "OH", category: "unsanitary" },
  { value: "op", label: "Open-pit Latrine", abbreviation: "OP", category: "unsanitary" },
  { value: "wo", label: "Without toilet", abbreviation: "WO", category: "unsanitary" },
]
