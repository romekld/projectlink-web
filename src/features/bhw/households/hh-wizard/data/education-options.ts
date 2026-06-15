export interface SelectOption {
  value: string
  label: string
  abbreviation?: string
}

export const educationOptions: SelectOption[] = [
  { value: "none", label: "None", abbreviation: "N" },
  { value: "preschool", label: "Pre-school", abbreviation: "PS" },
  { value: "elem-student", label: "Elem Student", abbreviation: "ES" },
  { value: "elem-undergrad", label: "Elem Undergrad", abbreviation: "EU" },
  { value: "elem-grad", label: "Elem Graduate", abbreviation: "EG" },
  { value: "hs-student", label: "HS Student", abbreviation: "HS" },
  { value: "hs-undergrad", label: "HS Undergrad", abbreviation: "HU" },
  { value: "hs-grad", label: "HS Graduate", abbreviation: "HG" },
  { value: "senior-hs", label: "Senior H/S", abbreviation: "SH" },
  { value: "als", label: "Adv Learning System", abbreviation: "ALS" },
  { value: "vocational", label: "Vocational Course", abbreviation: "V" },
  { value: "college-student", label: "College Student", abbreviation: "CS" },
  { value: "college-undergrad", label: "College Undergrad", abbreviation: "CU" },
  { value: "college-grad", label: "College Graduate", abbreviation: "CG" },
  { value: "postgrad", label: "Postgrad/Masteral/Doctorate", abbreviation: "PG" },
]
