"use client"

import { useState, useCallback } from "react";
import type { MapData } from "../../services/map-service"
import {
    booleanPointInPolygon,
    nearestPointOnLine,
    point,
    lineString,
} from "@turf/turf"

import { Card } from "@/components/ui/card";
import { HouseholdInfoForm } from "../forms/form-household-info"
import { Header } from "../layout/header"
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerPopup,
    MarkerTooltip,
    MapControls,
    MapGeoJSON,
} from "@/components/ui/map";
import { Hospital, MapPin } from "lucide-react"

interface Step2PinLocationProps {
  mapData: MapData | null
}

export function Step2PinLocation({ mapData }: Step2PinLocationProps) {
    const defaultCenter: [number, number] = mapData?.centroid
        ? [mapData.centroid.lng, mapData.centroid.lat]
        : [120.9842, 14.5995] // fallback center (Manila / PH)

    const station = mapData?.station
    const locations = station
        ? [
              {
                  id: station.id,
                  name: station.name,
                  lng: station.lng,
                  lat: station.lat,
              },
          ]
        : []

    const [draggableMarker, setDraggableMarker] = useState({
        lng: defaultCenter[0],
        lat: defaultCenter[1],
    });

    const clampToBoundary = useCallback(
        (lng: number, lat: number): { lng: number; lat: number } => {
            if (!mapData?.area) return { lng, lat }

            const geom = mapData.area.features[0].geometry

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
        },
        [mapData],
    )

    const handleDrag = useCallback(
        (lngLat: { lng: number; lat: number }) => {
            setDraggableMarker(clampToBoundary(lngLat.lng, lngLat.lat))
        },
        [clampToBoundary],
    )

    const resetToCentroid = useCallback(() => {
        if (mapData?.centroid) {
            setDraggableMarker({ lng: mapData.centroid.lng, lat: mapData.centroid.lat })
        }
    }, [mapData])

    return (
        <>
            {/* Step 2: Basic Information */}
            <Header title="Step 2: Pin Household Location" description="Enter the household's basic information." />


            {/* Mapcn llm.txt */}

            {/* Read the mapcn agent instructions at https://mapcn.dev/llms.txt, then install mapcn in this project. Run npx shadcn@latest add @mapcn/map. Then add a basic example that imports Map and MapControls from "@/components/ui/map" and renders a map inside a sized container. Use the default tiled basemap for maps that need streets, labels, or geographic context. If the user wants a blank/data-only map, such as countries or country borders, use <Map blank> with MapGeoJSON and either a user-provided GeoJSON URL/object or a world countries GeoJSON source. Preserve the existing Tailwind CSS and shadcn/ui setup. Do not manually rewrite the registry component unless the command fails; if it fails, inspect https://mapcn.dev/r/map.json and install the listed dependencies. */}

            <Card className="h-full p-0 overflow-hidden">
                <Map
                    center={defaultCenter}
                    zoom={16}
                    styles={{
                        light: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
                        dark: `https://api.maptiler.com/maps/darkmatter/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
                    }}
                >
                    {mapData?.area && (
                        <MapGeoJSON
                            data={mapData.area}
                            // change this to var(--primary-foreground)
                            fillPaint={{ "fill-color": "#ecfdf5", "fill-opacity": 0.40 }}
                            // change this to var(--primary)
                            linePaint={{ "line-color": "#007a55", "line-width": 2 }}
                        />
                    )}
                    <MapControls
                        // do not change these control options as they are used in the mapcn agent instructions
                        position="top-right"
                        showCompass
                        showFullscreen
                        showLocate
                    />
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
                    {locations.map((location) => (
                        <MapMarker
                            key={location.id}
                            longitude={location.lng}
                            latitude={location.lat}
                        >
                            <MarkerContent>
                                {/* <div className="bg-primary size-4 rounded-full border-2 border-white shadow-lg" /> */}
                                <Hospital
                                    className="text-primary"
                                    size={28}
                                />
                            </MarkerContent>
                            <MarkerTooltip>{location.name}</MarkerTooltip>
                            <MarkerPopup>
                                <div className="space-y-1 text-center">
                                    <p className="text-muted-foreground text-xs tabular-nums">
                                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                    </p>
                                    <p className="text-foreground font-medium !font-heading text-sm ">
                                        {location.name}

                                    </p>
                                </div>
                            </MarkerPopup>
                        </MapMarker>
                    ))}
                </Map>
            </Card>

        </>

    )
}
