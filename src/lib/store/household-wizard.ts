import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface HouseholdMember {
  id: string
  lastName: string
  firstName: string
  middleName?: string
  relationshipToHhHead: string
  sex: string
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
  classification?: string
  usingFp?: boolean
  fpMethod?: string
  fpStatus?: string
  waterSource?: string
  toiletFacility?: string
}

export interface HouseholdData {
  visitDate?: string
  quarter?: string
  householdNo?: string
  barangay?: string
  houseNoStreet?: string
  purok?: string
  respondentLastName?: string
  respondentFirstName?: string
  respondentMiddleName?: string
  waterSource?: string
  toiletFacility?: string
  numberOfFamilies?: number
}

interface HouseholdWizardState {
  currentStep: number
  householdData: HouseholdData
  members: HouseholdMember[]
  validationErrors: Record<string, string>
  editingMemberId: string | null
  isEditingDrawerOpen: boolean
  
  // Actions
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  setHouseholdData: (data: Partial<HouseholdData>) => void
  addMember: (member: HouseholdMember) => void
  updateMember: (id: string, member: Partial<HouseholdMember>) => void
  deleteMember: (id: string) => void
  setValidationError: (field: string, error: string) => void
  clearValidationErrors: () => void
  resetWizard: () => void
  setEditingMember: (id: string | null) => void
  setEditingDrawerOpen: (open: boolean) => void
}

const initialState = {
  currentStep: 0,
  householdData: {},
  members: [],
  validationErrors: {},
  editingMemberId: null,
  isEditingDrawerOpen: false,
}

export const useHouseholdWizard = create<HouseholdWizardState>()(
  persist(
    (set) => ({
      ...initialState,

      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 2) 
      })),

      previousStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 0) 
      })),

      goToStep: (step) => set({ currentStep: step }),

      setHouseholdData: (data) => set((state) => ({
        householdData: { ...state.householdData, ...data }
      })),

      addMember: (member) => set((state) => ({
        members: [...state.members, member]
      })),

      updateMember: (id, updatedMember) => set((state) => ({
        members: state.members.map((member) =>
          member.id === id ? { ...member, ...updatedMember } : member
        )
      })),

      deleteMember: (id) => set((state) => {
        const remainingMembers = state.members.filter((member) => member.id !== id)
        const deletedMember = state.members.find((member) => member.id === id)
        
        // If we deleted the head and there are other members left, 
        // make the first remaining member the head
        if (deletedMember?.relationshipToHhHead === "1-Head" && remainingMembers.length > 0) {
          remainingMembers[0].relationshipToHhHead = "1-Head"
        }

        return {
          members: remainingMembers
        }
      }),

      setValidationError: (field, error) => set((state) => ({
        validationErrors: { ...state.validationErrors, [field]: error }
      })),

      clearValidationErrors: () => set({ validationErrors: {} }),

      resetWizard: () => set(initialState),

      setEditingMember: (id) => set({ editingMemberId: id }),

      setEditingDrawerOpen: (open) => set({ isEditingDrawerOpen: open }),
    }),
    {
      name: 'household-wizard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
