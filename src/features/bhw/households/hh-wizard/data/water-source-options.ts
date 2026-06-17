export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const waterSourceOptions: SelectOption[] = [
  { value: "Level I", label: "Level I (Point Source)", abbreviation: "Lv I" },
  { value: "Level II", label: "Level II (Communal Faucet)", abbreviation: "Lv II" },
  { value: "Level III", label: "Level III (Individual Connection)", abbreviation: "Lv III" },
]
