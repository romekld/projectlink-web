import { createClient } from "@/lib/supabase/client"
import { computeCentroid } from "./geometry-utils"

export interface BarangayBoundary {
  area: GeoJSON.FeatureCollection
  centroid: { lng: number; lat: number }
}

export async function getBarangayBoundary(cityBarangayId: string): Promise<BarangayBoundary | null> {
  const supabase = createClient()

  const { data } = await supabase
    .from("city_barangays")
    .select("geometry")
    .eq("id", cityBarangayId)
    .single()

  if (!data?.geometry) return null

  const geometry = data.geometry as GeoJSON.Geometry

  const area: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry,
      },
    ],
  }

  const centroid = computeCentroid(geometry) ?? { lng: 120.9842, lat: 14.5995 }

  return { area, centroid }
}
