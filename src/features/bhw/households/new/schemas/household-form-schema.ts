import { z } from "zod"

/* ------------------------------------------------------------------ */
/*  Per-step field paths for scoped validation triggers               */
/* ------------------------------------------------------------------ */

export const STEP_1_FIELDS = [
  "barangay",
  "addressLine1",
  "addressLine2",
  "respondentLastName",
  "respondentFirstName",
  "respondentMiddleName",
  "waterSource",
  "toiletFacility",
  "visitDate",
  "familyCount",
  "is4ps",
  "is4psId",
  "isIndigenous",
] as const satisfies readonly string[]

export const STEP_2_FIELDS = ["latitude", "longitude"] as const satisfies readonly string[]

export const STEP_3_FIELDS = ["members"] as const satisfies readonly string[]

export type Step1Field = (typeof STEP_1_FIELDS)[number]
export type Step2Field = (typeof STEP_2_FIELDS)[number]
export type Step3Field = (typeof STEP_3_FIELDS)[number]

/* ------------------------------------------------------------------ */
/*  Reusable Zod primitives                                           */
/* ------------------------------------------------------------------ */

export const sexSchema = z.enum(["male", "female"], { message: "Sex is required" })

export const philhealthMembershipTypeSchema = z.enum(["M", "D"])

export const fpStatusSchema = z.enum(["NA", "CU", "CM", "CC", "DO", "R"])

/* ------------------------------------------------------------------ */
/*  Step 1 — Household Info                                           */
/* ------------------------------------------------------------------ */

export const householdInfoSchema = z
  .object({
    barangay: z.string().min(1, "Barangay is required"),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional().default(""),
    respondentLastName: z.string().min(1, "Last name is required"),
    respondentFirstName: z.string().min(1, "First name is required"),
    respondentMiddleName: z.string().optional().default(""),
    waterSource: z.string().min(1, "Water source is required"),
    toiletFacility: z.string().min(1, "Toilet facility is required"),
    visitDate: z.string().min(1, "Visit date is required"),
    familyCount: z.number().min(1, "At least 1 family required"),
    is4ps: z.boolean(),
    is4psId: z.string().optional().default(""),
    isIndigenous: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.is4ps && !data.is4psId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "4Ps ID is required",
        path: ["is4psId"],
      })
    }
  })

export type HouseholdInfoValues = z.input<typeof householdInfoSchema>

/* ------------------------------------------------------------------ */
/*  Step 2 — Pin Location                                             */
/* ------------------------------------------------------------------ */

export const pinLocationSchema = z.object({
  latitude: z.number({ message: "Pin the household location on the map" }),
  longitude: z.number({ message: "Pin the household location on the map" }),
})

export type PinLocationValues = z.input<typeof pinLocationSchema>

/* ------------------------------------------------------------------ */
/*  Step 3 — Household Member (array item)                            */
/* ------------------------------------------------------------------ */

export const memberFormSchema = z
  .object({
    lastName: z.string().min(1, "Last name is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional().default(""),
    sex: sexSchema,
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    relationship: z.string().min(1, "Relationship is required"),
    civilStatus: z.string().min(1, "Civil status is required"),
    education: z.string().optional().default(""),
    religion: z.string().optional().default(""),
    is4ps: z.boolean(),
    is4psId: z.string().optional().default(""),
    isIndigenous: z.boolean(),
    isPhilhealthMember: z.boolean(),
    philhealthId: z.string().optional().default(""),
    philhealthMembershipType: philhealthMembershipTypeSchema.optional().default("M"),
    philhealthCategory: z.string().optional().default(""),
    medicalHistory: z.array(z.string()),
    lmpDate: z.string().optional().default(""),
    usingFP: z.boolean(),
    fpMethods: z.array(z.string()),
    fpStatus: z.string().optional().default(""),
    age: z.number().optional().default(0),
    ageGroup: z.string().optional().default(""),
    isPregnant: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.is4ps && !data.is4psId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "4Ps ID is required",
        path: ["is4psId"],
      })
    }
    if (data.usingFP && data.fpMethods.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one FP method",
        path: ["fpMethods"],
      })
    }
    if (data.usingFP && !data.fpStatus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "FP status is required when using FP methods",
        path: ["fpStatus"],
      })
    }
  })

export type MemberFormValues = z.input<typeof memberFormSchema>

/* ------------------------------------------------------------------ */
/*  Combined household form (all steps)                               */
/* ------------------------------------------------------------------ */

export const householdFormSchema = z.object({
  ...householdInfoSchema.shape,
  ...pinLocationSchema.shape,
  members: z.array(memberFormSchema).min(1, "Add at least one household member"),
})

export type HouseholdFormValues = z.input<typeof householdFormSchema>

/* ------------------------------------------------------------------ */
/*  Field-level step mapping for trigger() lookup                     */
/* ------------------------------------------------------------------ */

export const stepFieldMap: Record<number, readonly string[]> = {
  0: STEP_1_FIELDS as unknown as readonly string[],
  1: STEP_2_FIELDS as unknown as readonly string[],
  2: STEP_3_FIELDS as unknown as readonly string[],
}
