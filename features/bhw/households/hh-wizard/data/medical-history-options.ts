export interface CheckboxOption {
  value: string
  label: string
  code: string
  requiresOther?: boolean
}

export const medicalHistoryOptions: CheckboxOption[] = [
  { value: "hypertension", label: "Hypertension", code: "HPN" },
  { value: "diabetes", label: "Diabetes", code: "DM" },
  { value: "tuberculosis", label: "Tuberculosis", code: "TB" },
  { value: "other", label: "Others (please specify)", code: "O", requiresOther: true },
]
