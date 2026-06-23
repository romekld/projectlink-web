export interface SelectOption {
  value: string
  label: string
  code?: string
}

export const educationOptions: SelectOption[] = [
  { value: "none", label: "None", code: "N" },
  { value: "preschool", label: "Pre-school", code: "PS" },
  { value: "elem-student", label: "Elem Student", code: "ES" },
  { value: "elem-undergrad", label: "Elem Undergrad", code: "EU" },
  { value: "elem-grad", label: "Elem Graduate", code: "EG" },
  { value: "hs-student", label: "HS Student", code: "HS" },
  { value: "hs-undergrad", label: "HS Undergrad", code: "HU" },
  { value: "hs-grad", label: "HS Graduate", code: "HG" },
  { value: "senior-hs", label: "Senior H/S", code: "SH" },
  { value: "als", label: "Adv Learning System", code: "ALS" },
  { value: "vocational", label: "Vocational Course", code: "V" },
  { value: "college-student", label: "College Student", code: "CS" },
  { value: "college-undergrad", label: "College Undergrad", code: "CU" },
  { value: "college-grad", label: "College Graduate", code: "CG" },
  { value: "postgrad", label: "Postgrad/Masteral/Doctorate", code: "PG" },
]
