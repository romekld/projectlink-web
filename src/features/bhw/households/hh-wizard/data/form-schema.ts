import { z } from "zod"

// Updated to match DATABASE_DESIGN.md and new migration
export const householdSchema = z.object({
  visitDate: z.string().min(1, "Visit date is required"),
  quarter: z.coerce.number().min(1).max(4),
  barangayId: z.string().uuid("Barangay is required"),
  houseNoStreet: z.string().optional(),
  purok: z.string().optional(),
  enumerationArea: z.string().optional(),
  familyCount: z.coerce.number().min(1, "Family count must be at least 1"),
  respondentLastName: z.string().min(1, "Last name is required"),
  respondentFirstName: z.string().min(1, "First name is required"),
  respondentMiddleName: z.string().optional(),
  waterSource: z.enum(['Level I', 'Level II', 'Level III']),
  toiletFacility: z.enum(['Sanitary-VIP', 'Sanitary-Septic', 'Unsanitary-Open', 'None']),
})

export const memberSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  birthdate: z.string().min(1, "Birthdate is required"),
  sex: z.enum(["M", "F"]),
  relationship: z.enum(['Head', 'Spouse', 'Son', 'Daughter', 'Other']),
  civilStatus: z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Cohabitation']),
  nhtsStatus: z.enum(['4Ps', 'Non-4Ps']),
  fourPsId: z.string().optional(),
  philhealthId: z.string().optional(),
  phCategory: z.enum(['Direct', 'Indirect', 'Unknown']),
  medicalHistory: z.array(z.string()).default([]),
  classification: z.enum([
    'Infant', 'Child', 'Adolescent', 'WRA', 'Pregnant', 'Post-Partum', 'Senior Citizen', 'PWD', 'Adult'
  ]),
  isPregnant: z.boolean().default(false),
  lmp: z.string().optional(),
  usingFp: z.boolean().default(false),
  fpMethod: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  metadata: z.record(z.any()).default({}),
})

export const completeHouseholdSchema = z.object({
  household: householdSchema,
  members: z.array(memberSchema).min(1, "At least one member is required")
    .refine(
      (members) => members.some(m => m.relationship === 'Head'),
      "Household head is required"
    ),
})

export type HouseholdValues = z.infer<typeof householdSchema>
export type MemberValues = z.infer<typeof memberSchema>
export type CompleteHouseholdValues = z.infer<typeof completeHouseholdSchema>

// UI-specific schemas for wizard steps
export const step1Schema = householdSchema
export const step2Schema = z.object({
  members: z.array(memberSchema).min(1, "At least one member is required")
    .refine(
      (members) => members.some(m => m.relationship === 'Head'),
      "Household head is required"
    )
})
