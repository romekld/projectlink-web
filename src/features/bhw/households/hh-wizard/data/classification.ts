type ClassificationOption = {
  code: string
  label: string
  description: string
}

export const classificationOptions: ClassificationOption[] = [
  { code: "Infant", label: "Infant", description: "0–11 months old" },
  { code: "Child", label: "Child", description: "1–9 years old" },
  { code: "Adolescent", label: "Adolescent", description: "10–19 years old" },
  { code: "WRA", label: "WRA", description: "Female, 15–49 years old" },
  { code: "Pregnant", label: "Pregnant", description: "Currently pregnant" },
  { code: "Post-Partum", label: "Post-Partum", description: "Gave birth recently" },
  { code: "Senior Citizen", label: "Senior Citizen", description: "60+ years old" },
  { code: "PWD", label: "PWD", description: "Person with disability" },
  { code: "Adult", label: "Adult", description: "20–59 years old" },
]

export function computeAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function computeAgeDays(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  return Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24))
}

export function autoSuggestClassification(
  dateOfBirth: string,
  sex: "M" | "F"
): string | undefined {
  if (!dateOfBirth) return undefined

  const ageDays = computeAgeDays(dateOfBirth)
  const age = computeAge(dateOfBirth)

  if (ageDays < 0) return undefined
  if (age < 1) return "Infant"
  if (age < 10) return "Child"
  if (age < 20) return "Adolescent"
  if (age >= 60) return "Senior Citizen"

  if (sex === "F") {
    if (age >= 15 && age <= 49) return "WRA"
  }

  if (age >= 20 && age <= 59) return "Adult"

  return undefined
}
