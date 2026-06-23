"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { MapData } from "./services/map-service"
import { useWizardStore, WIZARD_STEPS, TOTAL_STEPS, type WizardStepId } from "./stores/wizard-store"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Step1HouseholdInfo } from "./components/steps/step1-household-info"
import { Step3MemberInfo } from "./components/steps/step3-members"
import { Step2PinLocation } from "./components/steps/step2-pin-location"

interface NewHouseholdPageProps {
  mapData: MapData | null
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
}

export function NewHouseholdPage({ mapData }: NewHouseholdPageProps) {
  const { currentStep, nextStep, previousStep, resetWizard } = useWizardStore()

  const [direction, setDirection] = useState(0)

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOTAL_STEPS - 1

  const handleNext = useCallback(() => {
    setDirection(1)
    nextStep()
  }, [nextStep])

  const handlePrevious = useCallback(() => {
    setDirection(-1)
    previousStep()
  }, [previousStep])

  const handleClose = useCallback(() => {
    if (confirm("Are you sure you want to close? Your progress will be saved as a draft.")) {
      resetWizard()
    }
  }, [resetWizard])

  const handleBack = useCallback(() => {
    if (isFirstStep) {
      handleClose()
    } else {
      handlePrevious()
    }
  }, [isFirstStep, handleClose, handlePrevious])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "Enter" && !isLastStep) handleNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleClose, handleNext, isLastStep])

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <Button variant="ghost" size="icon" className="size-10" onClick={handleBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-base font-semibold">New e-ITR</h1>
        <Button variant="ghost" size="icon" className="size-10" onClick={handleClose}>
          <X className="size-5" />
        </Button>
      </header>

      {/* Main Content with Animated Transitions */}
      <main className="h-full flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-1 flex-col"
          >
            {currentStep === 0 && <Step1HouseholdInfo />}
            {currentStep === 1 && <Step2PinLocation mapData={mapData} />}
            {currentStep === 2 && <Step3MemberInfo />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Bar */}
      <footer className="shrink-0 border-t bg-background">
        <Progress value={progress} />
        <div className="flex items-center justify-between py-4 px-6">
          <span className="text-sm font-semibold">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" size="lg" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {!isLastStep ? (
              <Button className="px-8" size="lg" onClick={handleNext}>
                Next
                <ArrowRight />
              </Button>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  )
}
