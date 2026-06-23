export interface SelectOption {
  value: string
  label: string
  code?: string
}

export const waterSourceOptions: SelectOption[] = [
  { value: "Level I", label: "Point Source", code: "Level I" },
  { value: "Level II", label: "Communal Faucet system or stand posts", code: "Level II" },
  { value: "Level III", label: "Waterworks system or individual house connection", code: "Level III" },
  { value: "O", label: "For doubtful sources, open dug well etc.", code: "O" },
]
