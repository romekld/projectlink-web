"use client"

import { useState, useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Loader2 } from "lucide-react"
import {
  booleanPointInPolygon,
  nearestPointOnLine,
  point,
  lineString,
} from "@turf/turf"

import { Card } from "@/components/ui/card"
import { Header } from "../layout/header"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
  MapGeoJSON,
} from "@/components/ui/map"
import { Hospital, MapPin } from "lucide-react"

import type { HouseholdFormValues } from "../../schemas/household-form-schema"
import type { CoverageBarangay, StationInfo } from "../../services/map-service"
import type { MapData } from "../../services/map-service"
import { getBarangayBoundary } from "../../services/client-barangay-geometry"

interface Step2PinLocationProps {
  initialMapData: MapData | null
  station: StationInfo | null
  coverageBarangays: CoverageBarangay[]
}

export function Step2PinLocation({ initialMapData, station, coverageBarangays }: Step2PinLocationProps) {
  const { control, setValue } = useFormContext<HouseholdFormValues>()
  const barangayId = useWatch({ control, name: "barangay" })

  const defaultCenter: [number, number] = initialMapData?.centroid
    ? [initialMapData.centroid.lng, initialMapData.centroid.lat]
    : [120.9842, 14.5995]

  const [currentBoundary, setCurrentBoundary] = useState<MapData | null>(initialMapData)
  const [isLoading, setIsLoading] = useState(false)
  const [draggableMarker, setDraggableMarker] = useState({
    lng: defaultCenter[0],
    lat: defaultCenter[1],
  })
  const prevBarangayRef = useRef(barangayId)

  useEffect(() => {
    if (!barangayId || barangayId === prevBarangayRef.current) return
    prevBarangayRef.current = barangayId

    let cancelled = false
    setIsLoading(true)
    getBarangayBoundary(barangayId).then((result) => {
      if (cancelled) return
      setCurrentBoundary(result)
      setIsLoading(false)
      if (result?.centroid) {
        setDraggableMarker({ lng: result.centroid.lng, lat: result.centroid.lat })
        setValue("longitude", result.centroid.lng, { shouldValidate: true })
        setValue("latitude", result.centroid.lat, { shouldValidate: true })
      }
    })
    return () => { cancelled = true }
  }, [barangayId, setValue])

  const syncToForm = (lng: number, lat: number) => {
    setValue("longitude", lng, { shouldValidate: true })
    setValue("latitude", lat, { shouldValidate: true })
  }

  const clampToBoundary = (lng: number, lat: number): { lng: number; lat: number } => {
    if (!currentBoundary?.area) return { lng, lat }

    const geom = currentBoundary.area.features[0].geometry

    if (geom.type !== "Polygon" && geom.type !== "MultiPolygon") return { lng, lat }

    const coords: number[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates.flatMap((p) => p)
        : [geom.coordinates[0]]

    const rings: number[][][] = coords

    const pt = point([lng, lat])

    const poly = geom.type === "MultiPolygon"
      ? { type: "MultiPolygon" as const, coordinates: geom.coordinates }
      : { type: "Polygon" as const, coordinates: geom.coordinates }

    if (booleanPointInPolygon(pt, poly)) {
      return { lng, lat }
    }

    let best: { lng: number; lat: number; dist: number } | null = null
    for (const ring of rings) {
      const line = lineString(ring)
      const snapped = nearestPointOnLine(line, pt)
      const d =
        (snapped.geometry.coordinates[0] - lng) ** 2 +
        (snapped.geometry.coordinates[1] - lat) ** 2
      if (!best || d < best.dist) {
        best = {
          lng: snapped.geometry.coordinates[0],
          lat: snapped.geometry.coordinates[1],
          dist: d,
        }
      }
    }

    return best ? { lng: best.lng, lat: best.lat } : { lng, lat }
  }

  const handleDrag = (lngLat: { lng: number; lat: number }) => {
    const clamped = clampToBoundary(lngLat.lng, lngLat.lat)
    setDraggableMarker(clamped)
    syncToForm(clamped.lng, clamped.lat)
  }

  const resetToCentroid = () => {
    if (currentBoundary?.centroid) {
      const { lng, lat } = currentBoundary.centroid
      setDraggableMarker({ lng, lat })
      syncToForm(lng, lat)
    }
  }

  const selectedBarangayName = coverageBarangays.find((b) => b.cityBarangayId === barangayId)?.name ?? "selected barangay"

  return (
    <>
      <Header
        title="Step 2: Pin Household Location"
        description={`Pin the household location within ${selectedBarangayName}.`}
      />

      <Card className="h-full p-0 overflow-hidden relative rounded-none">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading barangay boundary...
            </div>
          </div>
        )}
        <Map
          center={defaultCenter}
          zoom={16}
          styles={{
            light: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
            dark: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
          }}
        >
          {currentBoundary?.area && (
            <MapGeoJSON
              data={currentBoundary.area}
              fillPaint={{ "fill-color": "#ecfdf5", "fill-opacity": 0.40 }}
              linePaint={{ "line-color": "#007a55", "line-width": 2 }}
            />
          )}
          <MapControls
            position="top-right"
            showCompass
            showFullscreen
            showLocate
            onLocate={(coords) => handleDrag({ lng: coords.longitude, lat: coords.latitude })}
          />
          {station && (
            <MapMarker
              longitude={station.lng}
              latitude={station.lat}
            >
              <MarkerContent>
                <Hospital
                  className="text-primary"
                  size={28}
                />
              </MarkerContent>
              <MarkerTooltip>{station.name}</MarkerTooltip>
              <MarkerPopup>
                <div className="space-y-1 text-center">
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
                  </p>
                  <p className="text-foreground font-medium !font-heading text-sm ">
                    {station.name}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          )}
          <MapMarker
            draggable
            longitude={draggableMarker.lng}
            latitude={draggableMarker.lat}
            onDrag={handleDrag}
          >
            <MarkerContent>
              <div
                className="cursor-move"
                onDoubleClick={resetToCentroid}
                title="Double-click to reset to barangay center"
              >
                <MapPin
                  className="text-primary"
                  size={34}
                />
              </div>
            </MarkerContent>
            <MarkerPopup>
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-xs tabular-nums">Coordinates</p>
                <p className="text-foreground font-medium !font-heading text-sm ">
                  {draggableMarker.lat.toFixed(4)},{" "}
                  {draggableMarker.lng.toFixed(4)}
                </p>
                <button
                  type="button"
                  onClick={resetToCentroid}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Reset to barangay center
                </button>
              </div>
            </MarkerPopup>
          </MapMarker>
        </Map>
      </Card>
    </>
  )
}
