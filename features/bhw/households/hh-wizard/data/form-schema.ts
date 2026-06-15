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
  memberLastName: z.string().min(1, "Last name is required"),
  memberFirstName: z.string().min(1, "First name is required"),
  memberMiddleName: z.string().optional(),
  memberMothersMaidenName: z.string().optional(),
  relationshipToHhHead: z.enum([
    "1-Head",
    "2-Spouse",
    "3-Son",
    "4-Daughter",
    "5-Others",
  ]),
  sex: z.enum(["M", "F"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  dobEstimated: z.boolean(),
  classificationQ1: z.string().optional(),
  memberPhilhealthId: z.string().optional(),
  memberRemarks: z.string().optional(),
})

export type HouseholdInfoValues = z.infer<typeof householdInfoSchema>
export type MemberValues = z.infer<typeof memberSchema>

// Step-specific validation schemas for the household wizard

export const step1Schema = z.object({
  visitDate: z.string().min(1, "Visit date is required"),
  barangay: z.string().min(1, "Barangay is required"),
  respondentLastName: z.string().min(1, "Respondent last name is required"),
  respondentFirstName: z.string().min(1, "Respondent first name is required"),
  waterSource: z.string().optional(),
  toiletFacility: z.string().optional(),
})

export const step2Schema = z.object({
  members: z.array(z.object({
    relationshipToHhHead: z.string(),
  })).min(1, "At least one household member is required")
    .refine(
      (members) => members.some(m => m.relationshipToHhHead === "1-Head"),
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
