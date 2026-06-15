"use client"

import { useEffect, useCallback } from "react"
import { ArrowLeft, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { BasicInfoForm } from "./components/form/form-basic-info"
import { ReviewStep } from "./components/form/form-review"
import { useHouseholdWizard } from "@/lib/store/household-wizard"
import { step1Schema, step2Schema } from "./data/form-schema"
import { toast } from "sonner"

import { MembersPage } from "./components/form/form-members";

export function HHWizard() {
  const { 
    currentStep, 
    nextStep, 
    previousStep, 
    householdData, 
    members, 
    resetWizard,
    setValidationError,
    clearValidationErrors
  } = useHouseholdWizard()

  const handleNext = useCallback(() => {
    // Clear previous validation errors
    clearValidationErrors()

    // Validate before proceeding
    if (currentStep === 0) {
      const step1Validation = step1Schema.safeParse(householdData)
      if (!step1Validation.success) {
        // Sync errors to store for the form to display
        step1Validation.error.issues.forEach((err) => {
          if (err.path[0]) {
            setValidationError(err.path[0] as string, err.message)
          }
        })
        toast.error("Invalid Basic Information", {
          description: "Please check all required fields in Step 1.",
          position: "top-center"
        })
        return
      }
    }

    if (currentStep === 1) {
      const step2Validation = step2Schema.safeParse({ members })
      if (!step2Validation.success) {
        toast.error("Member Validation Failed", {
          description: step2Validation.error.issues[0].message,
          position: "top-center"
        })
        return
      }
    }

    nextStep()
  }, [currentStep, householdData, members, nextStep, setValidationError, clearValidationErrors])

  const handlePrevious = useCallback(() => {
    clearValidationErrors()
    previousStep()
  }, [previousStep, clearValidationErrors])

  const handleClose = useCallback(() => {
    if (confirm("Are you sure you want to close? Your progress will be saved as a draft.")) {
      resetWizard()
      // Navigate back or close
      console.log("Wizard closed")
    }
  }, [resetWizard])

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      handleClose()
    } else {
      handlePrevious()
    }
  }, [currentStep, handleClose, handlePrevious])

  const progress = ((currentStep + 1) / 3) * 100
  const isLastStep = currentStep === 2

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
      if (e.key === "Enter" && !isLastStep) {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isLastStep, handleClose, handleNext])

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Fixed Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-2">
        <Button variant="ghost" size="icon" className="size-10" onClick={handleBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold">New Household Profile</h1>
        <Button variant="ghost" size="icon" className="size-10" onClick={handleClose}>
          <X className="size-5" />
        </Button>
      </header>

      {/* Main Content with ScrollArea */}
      <main className="p-5 h-full flex-1 flex flex-col overflow-y-auto">
        {/* Step 1: Basic Information */}
        {currentStep === 0 && <BasicInfoForm />}

        {/* Step 2: Household Members */}
        {currentStep === 1 && <MembersPage />}

        {/* Step 3: Review & Submit */}
        {currentStep === 2 && <ReviewStep />}
      </main>

      {/* Fixed Bottom Bar */}
      <footer className="shrink-0 border-t bg-background">
        <Progress value={progress} />
        <div className="flex items-center justify-between py-4 px-6">
          <span className="text-sm font-semibold">Step {currentStep + 1} of 3</span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {!isLastStep ? (
              <Button onClick={handleNext} className="px-8">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  )
}