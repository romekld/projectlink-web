export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const fpMethodOptions: SelectOption[] = [
  { value: "injectables", label: "Injectables" },
  { value: "iud", label: "IUD" },
  { value: "condom", label: "Condom" },
  { value: "lam", label: "LAM" },
  { value: "btl", label: "BTL" },
  { value: "implant", label: "Implant" },
  { value: "sdm", label: "SDM" },
  { value: "dpt", label: "DPT" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "other", label: "Others (please specify)" },
]
