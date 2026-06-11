"use server"

import { createClient } from "@/lib/supabase/server"
import { getGeometryCentroid } from "@/features/health-stations/pin-map/data"
import type { GeoJsonGeometry } from "@/features/health-stations/city-barangay-registry/data/schema"

type RegistryViewRow = {
  geometry: GeoJsonGeometry | null
}

export async function getBarangayCentroid(
  cityBarangayId: string
): Promise<{ lat: number; lng: number } | null> {
  const supabase = await createClient()

  const { data } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .from("city_barangay_registry_view" as any)
    .select("geometry")
    .eq("id", cityBarangayId)
    .single()

  if (!data) return null

  const row = data as unknown as RegistryViewRow
  if (!row.geometry) return null

  const centroid = getGeometryCentroid(row.geometry)
  return centroid ?? null
}
