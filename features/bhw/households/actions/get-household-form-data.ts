"use server"

import { createClient } from "@/lib/supabase/server"
import type { BarangayOption } from "@/features/bhw/households/components/barangay-combobox"

export type HouseholdFormData = {
  barangays: BarangayOption[]
  defaultBarangayId: string | null
}

type CoverageViewRow = {
  city_barangay_id: string | null
  barangay_name: string | null
  is_active: boolean | null
}

type AllBarangayRow = {
  city_barangay_id: string
  name: string
}

export async function getHouseholdFormData(): Promise<HouseholdFormData> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { barangays: [], defaultBarangayId: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("health_station_id")
    .eq("id", user.id)
    .single()

  if (!profile?.health_station_id) return { barangays: [], defaultBarangayId: null }

  const healthStationId = profile.health_station_id

  const [{ data: station }, { data: coverageRows }] = await Promise.all([
    supabase
      .from("health_stations")
      .select("physical_city_barangay_id")
      .eq("id", healthStationId)
      .single(),
    supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from("health_station_coverage_view" as any)
      .select("city_barangay_id, barangay_name, is_active")
      .eq("health_station_id", healthStationId)
      .eq("is_active", true)
      .order("barangay_name"),
  ])

  const physicalCityBarangayId = station?.physical_city_barangay_id ?? null

  const scopedBarangays: BarangayOption[] = ((coverageRows ?? []) as unknown as CoverageViewRow[])
    .filter((r): r is { city_barangay_id: string; barangay_name: string; is_active: boolean | null } =>
      !!r.city_barangay_id && !!r.barangay_name
    )
    .map((r) => ({ id: r.city_barangay_id, name: r.barangay_name }))

  let barangays: BarangayOption[]

  if (scopedBarangays.length > 0) {
    barangays = scopedBarangays
  } else {
    // Station has no coverage configured yet — show all active barangays as fallback
    const { data: allRows } = await supabase
      .from("barangays")
      .select("city_barangay_id, name")
      .eq("is_active", true)
      .order("name")

    barangays = ((allRows ?? []) as unknown as AllBarangayRow[]).map((r) => ({
      id: r.city_barangay_id,
      name: r.name,
    }))
  }

  const defaultBarangayId =
    physicalCityBarangayId && barangays.some((b) => b.id === physicalCityBarangayId)
      ? physicalCityBarangayId
      : null

  return { barangays, defaultBarangayId }
}
