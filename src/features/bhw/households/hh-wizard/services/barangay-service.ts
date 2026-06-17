import { createClient } from "@/lib/supabase/server"

export interface BarangayOption {
  id: string
  name: string
}

export const barangayService = {
  /**
   * Fetches active barangays for the BHW's health station.
   * If the station has no specific coverage, it falls back to all active barangays.
   */
  async getBarangayOptions() {
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

    const scopedBarangays: BarangayOption[] = ((coverageRows ?? []) as any[])
      .filter((r) => !!r.city_barangay_id && !!r.barangay_name)
      .map((r) => ({ id: r.city_barangay_id, name: r.barangay_name }))

    let barangays: BarangayOption[]

    if (scopedBarangays.length > 0) {
      barangays = scopedBarangays
    } else {
      // Fallback to all active barangays
      const { data: allRows } = await supabase
        .from("barangays")
        .select("city_barangay_id, name")
        .eq("is_active", true)
        .order("name")

      barangays = ((allRows ?? []) as any[]).map((r) => ({
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
}
