export interface SelectOptionGroup {
  label: string;
  items: {
    value: string;
    code: string;
    label: string;
  }[];
}

export const toiletFacilityOptions: SelectOptionGroup[] = [
  {
    label: "Sanitary Toilet",
    items: [
      { value: "P", code: "P", label: "Pour / flush toilet connected to septic tank" },
      { value: "PF", code: "PF", label: "Pour / flush toilet connected to septic tank and to sewerage system" },
      { value: "VIP", code: "VIP", label: "Ventilated improved pit latrine (VIP) or composting toilet" },
    ],
  },
  {
    label: "Unsanitary Toilet",
    items: [
      { value: "WS", code: "WS", label: "Water-sealed connected to open drain" },
      { value: "OH", code: "OH", label: "Overhung Latrine" },
      { value: "OP", code: "OP", label: "Open-pit Latrine" },
      { value: "WO", code: "WO", label: "Without toilet" },
    ],
  },
];