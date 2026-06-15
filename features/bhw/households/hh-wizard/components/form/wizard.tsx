"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DrawerClose } from "@/components/ui/drawer"

export interface WizardStep {
  id: string
  title: string
  component: React.ComponentType<WizardStepProps>
  condition?: (data: Record<string, unknown>) => boolean
}

export interface WizardStepProps {
  data: Record<string, unknown>
  onDataChange: (data: Record<string, unknown>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface WizardContextValue {
  currentStep: number
  totalSteps: number
  activeSteps: WizardStep[]
  progress: number
  formData: Record<string, unknown>
  handleNext: () => void
  handlePrevious: () => void
  handleCancel: () => void
  handleDataChange: (data: Record<string, unknown>) => void
  isFirstStep: boolean
  isLastStep: boolean
}

const WizardContext = React.createContext<WizardContextValue | undefined>(undefined)

export function useWizard() {
  const context = React.useContext(WizardContext)
  if (!context) {
    throw new Error("useWizard must be used within a Wizard")
  }
  return context
}

interface WizardProps {
  steps: WizardStep[]
  onSubmit: (data: Record<string, unknown>) => void
  onCancel: () => void
  initialData?: Record<string, unknown>
  children?: React.ReactNode
}

export function Wizard({ steps, onSubmit, onCancel, initialData = {}, children }: WizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, unknown>>(initialData)

  // Reset form data when initialData changes (e.g. when opening for different member types)
  React.useEffect(() => {
    setFormData(initialData)
    setCurrentStep(0)
  }, [initialData])

  // Filter steps based on conditions
  const activeSteps = React.useMemo(() => {
    return steps.filter(step => !step.condition || step.condition(formData))
  }, [steps, formData])

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onSubmit(formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDataChange = (data: Record<string, unknown>) => {
    setFormData({ ...formData, ...data })
  }

  const handleCancel = () => {
    // Save draft to localStorage
    localStorage.setItem('member-draft', JSON.stringify(formData))
    onCancel()
  }

  const progress = ((currentStep + 1) / activeSteps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === activeSteps.length - 1

  const value = {
    currentStep,
    totalSteps: activeSteps.length,
    activeSteps,
    progress,
    formData,
    handleNext,
    handlePrevious,
    handleCancel,
    handleDataChange,
    isFirstStep,
    isLastStep,
  }

  if (children) {
    return (
      <WizardContext.Provider value={value}>
        {children}
      </WizardContext.Provider>
    )
  }

  return (
    <WizardContext.Provider value={value}>
      <div className="flex flex-col h-full">
        <WizardFooter />
        <WizardContent />
      </div>
    </WizardContext.Provider>
  )
}

export function WizardContent() {
  const { activeSteps, currentStep, formData, handleDataChange, handleNext, handlePrevious, isFirstStep, isLastStep } = useWizard()
  const CurrentStepComponent = activeSteps[currentStep].component

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <CurrentStepComponent
        data={formData}
        onDataChange={handleDataChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
      />
    </div>
  )
}

export function WizardProgress({ className }: { className?: string }) {
  const { progress } = useWizard()
  return <Progress value={progress} className={className} />
}

export function WizardFooter() {
  const { currentStep, totalSteps, handleCancel, handlePrevious, handleNext, isLastStep } = useWizard()

  return (
    <div className="shrink-0 ">
      <div className="flex items-center justify-between py-4 px-6">
        <span className="text-sm font-semibold">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="flex gap-2">
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DrawerClose>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          <Button onClick={handleNext}>
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

