import { z } from "zod"

// Updated to match DATABASE_DESIGN.md and new migration
export const householdSchema = z.object({
  year: z.number({ message: "Year is required" }).min(2020, "Year must be at least 2020").max(2100, "Year must be at most 2100"),
  quarter: z.number({ message: "Quarter is required" }).min(1, "Quarter must be at least 1").max(4, "Quarter must be at most 4"),
  visitDate: z.string().min(1, "Date of visit is required"),
  barangayId: z.string().uuid("Please select a barangay"),
  houseNoStreet: z.string().optional(),
  purok: z.string().optional(),
  respondentLastName: z.string().min(1, "Respondent last name is required"),
  respondentFirstName: z.string().min(1, "Respondent first name is required"),
  respondentMiddleName: z.string().optional(),
})

export const memberSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  birthdate: z.string().min(1, "Birthdate is required"),
  sex: z.enum(["M", "F"], {
    message: "Please select sex"
  }),
  relationship: z.enum(['Head', 'Spouse', 'Son', 'Daughter', 'Other'], {
    message: "Please select relationship"
  }),
  specifyRelation: z.string().optional(),
  civilStatus: z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Cohabitation'], {
    message: "Please select civil status"
  }),
  nhtsStatus: z.enum(['4Ps', 'Non-4Ps'], {
    message: "Please select NHTS status"
  }),
  fourPsId: z.string().optional(),
  philhealthId: z.string().optional(),
  phCategory: z.enum(['Direct', 'Indirect', 'Unknown'], {
    message: "Please select PhilHealth category"
  }),
  medicalHistory: z.array(z.string()).default([]),
  medicalOther: z.string().optional(),
  classification: z.enum([
    'Infant', 'Child', 'Adolescent', 'WRA', 'Pregnant', 'Post-Partum', 'Senior Citizen', 'PWD', 'Adult'
  ], {
    message: "System classification is required"
  }),
  isPregnant: z.boolean().default(false),
  lmp: z.string().optional(),
  usingFp: z.boolean().default(false),
  fpMethod: z.string().optional(),
  fpMethodOther: z.string().optional(),
  fpStatus: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  specifyReligion: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
}).superRefine((data, ctx) => {
  // Conditional: Specify Relation
  if (data.relationship === 'Other' && (!data.specifyRelation || data.specifyRelation.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the relationship",
      path: ['specifyRelation'],
    });
  }

  // Conditional: Specify Religion
  if (data.religion === 'other' && (!data.specifyReligion || data.specifyReligion.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the religion",
      path: ['specifyReligion'],
    });
  }

  // Conditional: Medical Other
  if (data.medicalHistory.includes('other') && (!data.medicalOther || data.medicalOther.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the medical condition",
      path: ['medicalOther'],
    });
  }

  // Conditional: 4Ps ID
  if (data.nhtsStatus === '4Ps' && (!data.fourPsId || data.fourPsId.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "4Ps ID is required for 4Ps members",
      path: ['fourPsId'],
    });
  }

  // Conditional: LMP for pregnant
  if (data.isPregnant && (!data.lmp || data.lmp.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "LMP date is required",
      path: ['lmp'],
    });
  }

  // Conditional: FP Method Other
  if (data.usingFp && data.fpMethod === 'other' && (!data.fpMethodOther || data.fpMethodOther.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the FP method",
      path: ['fpMethodOther'],
    });
  }

  // Conditional: FP Status for FP users
  if (data.usingFp && (!data.fpStatus || data.fpStatus.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select FP status",
      path: ['fpStatus'],
    });
  }
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
