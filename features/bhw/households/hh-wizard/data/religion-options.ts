export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const religionOptions: SelectOption[] = [
  { value: "roman-catholic", label: "Roman Catholic" },
  { value: "christian", label: "Christian" },
  { value: "inc", label: "INC" },
  { value: "catholic", label: "Catholic" },
  { value: "islam", label: "Islam" },
  { value: "baptist", label: "Baptist" },
  { value: "born-again", label: "Born Again Christian" },
  { value: "buddhism", label: "Buddhism" },
  { value: "church-of-god", label: "Church of God" },
  { value: "jehovahs-witness", label: "Jehovah's Witness" },
  { value: "protestant", label: "Protestant" },
  { value: "seventh-day-adventist", label: "Seventh Day Adventist" },
  { value: "lds-mormons", label: "LDS-Mormons" },
  { value: "evangelical", label: "Evangelical" },
  { value: "pentecostal", label: "Pentecostal" },
  { value: "unknown", label: "Unknown" },
  { value: "other", label: "Others (please specify)" },
]
