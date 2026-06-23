"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { FormProvider } from "react-hook-form"
import { ArrowLeft, ArrowRight, X, Loader2, Eye, CheckCircle2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useWizardStore, TOTAL_STEPS } from "./stores/wizard-store"
import { useHouseholdForm } from "./components/hooks/use-household-form"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Step1HouseholdInfo } from "./components/steps/step1-household-info"
import { Step3MemberInfo } from "./components/steps/step3-members"
import { Step2PinLocation } from "./components/steps/step2-pin-location"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { getSubmissionPayload, type SubmissionPayload } from "./services/submit-household"
import { submitHouseholdAction, type SubmitResult } from "./actions/submit-household-action"

import type { CoverageBarangay, StationInfo } from "./services/map-service"
import type { MapData } from "./services/map-service"

interface NewHouseholdPageProps {
  coverageBarangays: CoverageBarangay[]
  initialMapData: MapData | null
  station: StationInfo | null
}

type DialogMode = "preview" | "submitting" | "success" | "error"

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

export function NewHouseholdPage({ coverageBarangays, initialMapData, station }: NewHouseholdPageProps) {
  const { currentStep, nextStep, previousStep, resetWizard } = useWizardStore()
  const { form, validateStep, syncToStore } = useHouseholdForm()

  const [direction, setDirection] = useState(0)
  const [submissionPayload, setSubmissionPayload] = useState<SubmissionPayload | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>("preview")
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOTAL_STEPS - 1

  const handleNext = useCallback(async () => {
    const valid = await validateStep(currentStep)
    if (!valid) return

    syncToStore()
    setDirection(1)
    nextStep()
  }, [currentStep, validateStep, syncToStore, nextStep])

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

  const handleReview = useCallback(async () => {
    const step0valid = await validateStep(0)
    const step1valid = await validateStep(1)
    const step2valid = await validateStep(2)
    if (!step0valid || !step1valid || !step2valid) return

    syncToStore()

    const values = form.getValues()
    const payload = getSubmissionPayload(values, "")
    setSubmissionPayload(payload)
    setDialogMode("preview")
    setSubmitResult(null)
    setShowPreview(true)
  }, [form, validateStep, syncToStore])

  const handleConfirmSubmit = useCallback(() => {
    if (!submissionPayload) return
    setDialogMode("submitting")

    startTransition(async () => {
      const values = form.getValues()
      const result = await submitHouseholdAction({
        barangay: values.barangay,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        familyCount: values.familyCount,
        respondentLastName: values.respondentLastName,
        respondentFirstName: values.respondentFirstName,
        respondentMiddleName: values.respondentMiddleName,
        waterSource: values.waterSource,
        toiletFacility: values.toiletFacility,
        is4ps: values.is4ps,
        is4psId: values.is4psId,
        isIndigenous: values.isIndigenous,
        latitude: values.latitude,
        longitude: values.longitude,
        visitDate: values.visitDate,
        members: values.members,
      })
      setSubmitResult(result)
      setDialogMode(result.success ? "success" : "error")
    })
  }, [submissionPayload, form, startTransition])

  const handleDone = useCallback(() => {
    setShowPreview(false)
    resetWizard()
  }, [resetWizard])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "Enter" && !isLastStep) handleNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleClose, handleNext, isLastStep])

  return (
    <FormProvider {...form}>
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
              {currentStep === 0 && <Step1HouseholdInfo coverageBarangays={coverageBarangays} />}
              {currentStep === 1 && (
                <Step2PinLocation
                  initialMapData={initialMapData}
                  station={station}
                  coverageBarangays={coverageBarangays}
                />
              )}
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
              ) : (
                <Button className="px-8" size="lg" onClick={handleReview}>
                  <Eye />
                  Review & Submit
                </Button>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* Submission Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          className="sm:max-w-2xl max-h-[80dvh] flex flex-col"
          onInteractOutside={dialogMode === "submitting" ? (e) => e.preventDefault() : undefined}
        >
          {/* --- Preview Mode --- */}
          {dialogMode === "preview" && submissionPayload && (
            <>
              <DialogHeader>
                <DialogTitle>Submission Preview</DialogTitle>
                <DialogDescription>
                  Review the JSON payload before submitting.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-auto rounded-lg border bg-muted/30 p-4">
                <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all">
                  {JSON.stringify(submissionPayload, null, 2)}
                </pre>
              </div>

              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSubmit} disabled={isPending}>
                  Confirm & Submit
                </Button>
              </DialogFooter>
            </>
          )}

          {/* --- Submitting Mode --- */}
          {dialogMode === "submitting" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Submitting household record...</p>
            </div>
          )}

          {/* --- Success Mode --- */}
          {dialogMode === "success" && submitResult?.success && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-emerald-600" />
                  <DialogTitle>Submission Successful</DialogTitle>
                </div>
                <DialogDescription>
                  The household has been recorded.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Household ID</span>
                  <span className="font-mono">{submitResult.householdId}</span>
                </div>
                {submitResult.householdNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Household Number</span>
                    <span className="font-mono">{submitResult.householdNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span>{submissionPayload?.residents.length ?? 0}</span>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button onClick={handleDone}>
                  Start New Household
                </Button>
              </DialogFooter>
            </>
          )}

          {/* --- Error Mode --- */}
          {dialogMode === "error" && !submitResult?.success && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="size-6 text-destructive" />
                  <DialogTitle>Submission Failed</DialogTitle>
                </div>
                <DialogDescription>
                  {submitResult?.error ?? "An unexpected error occurred."}
                </DialogDescription>
              </DialogHeader>

              {submissionPayload && (
                <div className="flex-1 overflow-auto rounded-lg border bg-muted/30 p-4">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(submissionPayload, null, 2)}
                  </pre>
                </div>
              )}

              <DialogFooter className="mt-2">
                <Button variant="outline" onClick={() => setDialogMode("preview")}>
                  Back to Preview
                </Button>
                <Button onClick={handleDone}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

export function NewHouseholdPageSkeleton() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">Loading household form...</p>
    </div>
  )
}
