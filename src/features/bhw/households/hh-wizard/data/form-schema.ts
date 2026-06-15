import { z } from "zod"

export const householdInfoSchema = z.object({
  visitDate: z.string().min(1, "Visit date is required"),
  respondentLastName: z.string().min(1, "Last name is required"),
  respondentFirstName: z.string().min(1, "First name is required"),
  respondentMiddleName: z.string().optional(),
  nhtsStatus: z.enum(["NHTS-4Ps", "Non-NHTS"]),
  isIndigenousPeople: z.boolean(),
  hhHeadPhilhealthMember: z.boolean(),
  hhHeadPhilhealthId: z.string().optional(),
  hhHeadPhilhealthCategory: z
    .enum(["Formal Economy", "Informal Economy", "Indigent/Sponsored", "Senior Citizen", "Other"])
    .optional(),
  // Address fields
  houseNoStreet: z.string().min(1, "House No. & Street is required"),
  purok: z.string().optional(),
  barangayId: z.string().uuid("Please select a barangay"),
  barangayName: z.string().optional(),
  // Location
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
})

export const memberSchema = z.object({
  id: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  relationshipToHhHead: z.string().min(1, "Relationship is required"),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(),
  civilStatus: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  isIndigenousPeople: z.boolean().default(false),
  philhealthId: z.string().optional(),
  membershipType: z.string().optional(),
  philhealthCategory: z.string().optional(),
  medicalHistory: z.array(z.string()).default([]),
  medicalOther: z.string().optional(),
  classification: z.string().optional(),
  usingFp: z.boolean().optional(),
  fpMethod: z.string().optional(),
  fpStatus: z.string().optional(),
  lmp: z.string().optional(),
})

export type HouseholdInfoValues = z.infer<typeof householdInfoSchema>
export type MemberValues = {
  id: string
  lastName: string
  firstName: string
  middleName?: string
  relationshipToHhHead: string
  sex: "male" | "female"
  dateOfBirth: string
  age?: string
  civilStatus?: string
  education?: string
  religion?: string
  isIndigenousPeople?: boolean
  philhealthId?: string
  membershipType?: string
  philhealthCategory?: string
  medicalHistory?: string[]
  medicalOther?: string
  classification?: string
  usingFp?: boolean
  fpMethod?: string
  fpStatus?: string
  lmp?: string
}

// Step-specific validation schemas for the household wizard

export const step1Schema = z.object({
  visitDate: z.string().min(1, "Visit date is required"),
  barangay: z.string().min(1, "Barangay is required"),
  respondentLastName: z.string().min(1, "Respondent last name is required"),
  respondentFirstName: z.string().min(1, "Respondent first name is required"),
  waterSource: z.string().min(1, "Water source is required"),
  toiletFacility: z.string().min(1, "Toilet facility is required"),
  houseNoStreet: z.string().optional(),
  purok: z.string().optional(),
  quarter: z.string().optional(),
})

export const step2Schema = z.object({
  members: z.array(memberSchema).min(1, "At least one household member is required")
    .refine(
      (members) => members.some(m => m.relationshipToHhHead === "1-Head" || m.relationshipToHhHead === "1"),
      "Household head is required"
    )
})

export const step3Schema = z.object({
  householdData: step1Schema,
  members: step2Schema.shape.members,
})

export type Step1Values = z.infer<typeof step1Schema>
export type Step2Values = z.infer<typeof step2Schema>
export type Step3Values = z.infer<typeof step3Schema>
