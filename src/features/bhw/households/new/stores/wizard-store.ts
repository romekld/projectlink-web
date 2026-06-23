import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type WizardStepId = 0 | 1 | 2

export const WIZARD_STEPS = [
  { id: 0 as WizardStepId, label: "Household Info" },
  { id: 1 as WizardStepId, label: "Pin Location" },
  { id: 2 as WizardStepId, label: "Members" },
] as const

export const TOTAL_STEPS = WIZARD_STEPS.length

export interface HouseholdFormData {
  barangay: string
  addressLine1: string
  addressLine2: string
  respondentLastName: string
  respondentFirstName: string
  respondentMiddleName: string
  waterSource: string
  toiletFacility: string
  visitDate: string
  familyCount: number
  is4ps: boolean
  is4psId: string
  isIndigenous: boolean
}

export interface HouseholdMember {
  id: string
  lastName: string
  firstName: string
  middleName: string
  sex: "male" | "female"
  dateOfBirth: string
  age: number
  ageGroup: string
  relationship: string
  civilStatus: string
  education: string
  religion: string
  is4ps: boolean
  is4psId: string
  isIndigenous: boolean
  isPhilhealthMember: boolean
  philhealthId: string
  philhealthMembershipType: string
  philhealthCategory: string
  isPregnant: boolean
  medicalHistory: string[]
  lmpDate: string
  usingFP: boolean
  fpMethods: string[]
  fpStatus: string
}

interface WizardState {
  currentStep: WizardStepId
  formData: HouseholdFormData
  members: HouseholdMember[]
  pinLocation: { lng: number; lat: number } | null
}

interface WizardActions {
  goToStep: (step: WizardStepId) => void
  nextStep: () => void
  previousStep: () => void
  setFormData: (data: Partial<HouseholdFormData>) => void
  setPinLocation: (location: { lng: number; lat: number }) => void
  addMember: (member: HouseholdMember) => void
  updateMember: (id: string, data: Partial<HouseholdMember>) => void
  deleteMember: (id: string) => void
  resetWizard: () => void
}

const initialState = {
  currentStep: 0 as WizardStepId,
  formData: {
    barangay: "",
    addressLine1: "",
    addressLine2: "",
    respondentLastName: "",
    respondentFirstName: "",
    respondentMiddleName: "",
    waterSource: "",
    toiletFacility: "",
    visitDate: "",
    familyCount: 1,
    is4ps: false,
    is4psId: "",
    isIndigenous: false,
  },
  members: [] as HouseholdMember[],
  pinLocation: null as { lng: number; lat: number } | null,
}

export const useWizardStore = create<WizardState & WizardActions>()(
  persist(
    (set) => ({
      ...initialState,

      goToStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1) as WizardStepId,
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0) as WizardStepId,
        })),

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setPinLocation: (location) => set({ pinLocation: location }),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      updateMember: (id, data) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),

      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),

      resetWizard: () => set(initialState),
    }),
    {
      name: "bhw-new-household-wizard",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
