"use client"

import { useState, useCallback } from "react"
import { MapPin, Loader2, LocateFixed } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { HouseholdPinMap } from "./household-pin-map"
import { getBarangayCentroid } from "@/features/bhw/households/actions/get-barangay-centroid"

type PinCoordinates = { lat: number; lng: number }

type HouseholdLocationDialogProps = {
  barangayId: string | null
  currentPin: PinCoordinates | null
  onConfirm: (pin: PinCoordinates | null) => void
}

export function HouseholdLocationDialog({
  barangayId,
  currentPin,
  onConfirm,
}: HouseholdLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [draftPin, setDraftPin] = useState<PinCoordinates | null>(null)

  const resolveInitialPin = useCallback(
    async (existingPin: PinCoordinates | null) => {
      if (existingPin) {
        setDraftPin(existingPin)
        setMapReady(true)
        return
      }

      if (!barangayId) {
        setMapReady(true)
        return
      }

      try {
        const gpsPin = await new Promise<PinCoordinates>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            reject,
            { timeout: 5000, maximumAge: 30_000 }
          )
        })
        setDraftPin(gpsPin)
      } catch {
        const centroid = await getBarangayCentroid(barangayId)
        setDraftPin(centroid)
      } finally {
        setMapReady(true)
      }
    },
    [barangayId]
  )

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setMapReady(false)
      setDraftPin(null)
      resolveInitialPin(currentPin)
    }
  }

  function handleConfirm() {
    onConfirm(draftPin)
    setOpen(false)
  }

  function handleClear() {
    setDraftPin(null)
  }

  const hasPin = currentPin != null
  const triggerLabel = hasPin
    ? `${currentPin.lat.toFixed(5)}, ${currentPin.lng.toFixed(5)}`
    : "Set Location"

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2 font-normal"
        disabled={!barangayId}
        onClick={() => handleOpenChange(true)}
      >
        <MapPin className="size-4 shrink-0 text-muted-foreground" />
        <span className={hasPin ? "font-mono text-xs" : "text-muted-foreground"}>
          {!barangayId ? "Select a barangay first" : triggerLabel}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="gap-3 sm:max-w-lg"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LocateFixed className="size-4" />
              Set Household Pin
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-[60dvh] w-full overflow-hidden rounded-md border">
            {mapReady ? (
              <HouseholdPinMap
                barangayBoundary={null}
                barangayId={barangayId}
                currentPin={draftPin}
                onPinChange={(pin) => setDraftPin(pin)}
              />
            ) : (
              <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Locating…
              </div>
            )}
          </div>

          {draftPin && (
            <p className="text-center font-mono text-xs text-muted-foreground">
              {draftPin.lat.toFixed(6)}, {draftPin.lng.toFixed(6)}
            </p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Tap the map to place a pin, or drag it to reposition.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              disabled={!draftPin}
            >
              Clear pin
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
