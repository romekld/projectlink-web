import { z } from "zod"

// Updated to match DATABASE_DESIGN.md and new migration
export const householdSchema = z.object({
  visitDate: z.string().min(1, "Date of visit is required"),
  quarter: z.number({ required_error: "Quarter is required" }).min(1).max(4),
  barangayId: z.string().uuid("Please select a barangay"),
  houseNoStreet: z.string().optional(),
  purok: z.string().optional(),
  enumerationArea: z.string().optional(),
  familyCount: z.number({ required_error: "Family count is required" }).min(1, "Family count must be at least 1"),
  respondentLastName: z.string().min(1, "Respondent last name is required"),
  respondentFirstName: z.string().min(1, "Respondent first name is required"),
  respondentMiddleName: z.string().optional(),
  waterSource: z.string().min(1, "Please select a water source").pipe(z.enum(['Level I', 'Level II', 'Level III'])),
  toiletFacility: z.string().min(1, "Please select a toilet facility").pipe(z.enum(['Sanitary-VIP', 'Sanitary-Septic', 'Unsanitary-Open', 'None'])),
})

export const memberSchema = z.object({
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  birthdate: z.string().min(1, "Birthdate is required"),
  sex: z.string().min(1, "Please select sex").pipe(z.enum(["M", "F"])),
  relationship: z.string().min(1, "Please select relationship").pipe(z.enum(['Head', 'Spouse', 'Son', 'Daughter', 'Other'])),
  specifyRelation: z.string().optional(),
  civilStatus: z.string().min(1, "Please select civil status").pipe(z.enum(['Single', 'Married', 'Widowed', 'Separated', 'Cohabitation'])),
  nhtsStatus: z.string().min(1, "Please select NHTS status").pipe(z.enum(['4Ps', 'Non-4Ps'])),
  fourPsId: z.string().optional(),
  philhealthId: z.string().optional(),
  phCategory: z.string().min(1, "Please select PhilHealth category").pipe(z.enum(['Direct', 'Indirect', 'Unknown'])),
  medicalHistory: z.array(z.string()).default([]),
  medicalOther: z.string().optional(),
  classification: z.string().min(1, "System classification is required").pipe(z.enum([
    'Infant', 'Child', 'Adolescent', 'WRA', 'Pregnant', 'Post-Partum', 'Senior Citizen', 'PWD', 'Adult'
  ])),
  isPregnant: z.boolean().default(false),
  lmp: z.string().optional(),
  usingFp: z.boolean().default(false),
  fpMethod: z.string().optional(),
  fpMethodOther: z.string().optional(),
  fpStatus: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  specifyReligion: z.string().optional(),
  metadata: z.record(z.any()).default({}),
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

  // Conditional: FP fields for usingFp
  if (data.usingFp) {
    if (!data.fpMethod || data.fpMethod.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select an FP method",
        path: ['fpMethod'],
      });
    }
    if (!data.fpStatus || data.fpStatus.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select an FP status",
        path: ['fpStatus'],
      });
    }
  }

  // Conditional: FP Method Other
  if (data.fpMethod === 'other' && (!data.fpMethodOther || data.fpMethodOther.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the FP method",
      path: ['fpMethodOther'],
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
