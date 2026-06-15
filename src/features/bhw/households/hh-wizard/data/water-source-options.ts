export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const waterSourceOptions: SelectOption[] = [
  { value: "lv-i", label: "Point Source", abbreviation: "Lv I" },
  { value: "lv-ii", label: "Communal faucet system or stand posts", abbreviation: "Lv II" },
  { value: "lv-iii", label: "Waterworks system or individual house connection", abbreviation: "Lv III" },
  { value: "other", label: "For doubtful sources, open dug well etc.", abbreviation: "O" },
]
