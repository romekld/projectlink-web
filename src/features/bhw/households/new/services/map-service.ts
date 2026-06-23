import { createClient } from "@/lib/supabase/server"
import { computeCentroid } from "./geometry-utils"

export interface MapData {
  area: GeoJSON.FeatureCollection
  centroid: { lng: number; lat: number }
}

export interface StationInfo {
  id: string
  name: string
  lng: number
  lat: number
}

export interface CoverageBarangay {
  cityBarangayId: string
  name: string
  isPrimary: boolean
}

export const mapService = {
  async getCoverageBarangays(): Promise<CoverageBarangay[]> {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase
      .from("profiles")
      .select("health_station_id")
      .eq("id", user.id)
      .single()
    if (!profile?.health_station_id) return []

    const { data: coverage } = await supabase
      .from("health_station_coverage")
      .select("barangay_id, is_primary")
      .eq("health_station_id", profile.health_station_id)
      .eq("is_active", true)

    if (!coverage || coverage.length === 0) return []

    const barangayIds = coverage.map((c) => c.barangay_id)

    const { data: barangays } = await supabase
      .from("barangays")
      .select("id, city_barangay_id")
      .in("id", barangayIds)

    if (!barangays) return []

    const cityBarangayIds = barangays.map((b) => b.city_barangay_id)

    const { data: cityBarangays } = await supabase
      .from("city_barangays")
      .select("id, name")
      .in("id", cityBarangayIds)

    if (!cityBarangays) return []

    const cityMap = new Map(cityBarangays.map((cb) => [cb.id, cb.name]))

    return coverage.map((c) => {
      const barangay = barangays.find((b) => b.id === c.barangay_id)
      return {
        cityBarangayId: barangay?.city_barangay_id ?? "",
        name: cityMap.get(barangay?.city_barangay_id ?? "") ?? "",
        isPrimary: c.is_primary ?? false,
      }
    })
  },

  async getBarangayBoundary(cityBarangayId: string): Promise<{ area: GeoJSON.FeatureCollection; centroid: { lng: number; lat: number } } | null> {
    const supabase = await createClient()

    const { data: cityBarangay } = await supabase
      .from("city_barangays")
      .select("geometry")
      .eq("id", cityBarangayId)
      .single()
    if (!cityBarangay?.geometry) return null

    const geometry = cityBarangay.geometry as GeoJSON.Geometry

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
  },

  async getStationInfo(): Promise<StationInfo | null> {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from("profiles")
      .select("health_station_id")
      .eq("id", user.id)
      .single()
    if (!profile?.health_station_id) return null

    const { data: station } = await supabase
      .from("health_stations")
      .select("id, name, latitude, longitude")
      .eq("id", profile.health_station_id)
      .single()
    if (!station) return null

    return station.latitude && station.longitude
      ? {
          id: station.id,
          name: station.name,
          lng: station.longitude,
          lat: station.latitude,
        }
      : null
  },

  async getMapData(cityBarangayId?: string): Promise<{ mapData: MapData | null; station: StationInfo | null }> {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { mapData: null, station: null }

    const { data: profile } = await supabase
      .from("profiles")
      .select("health_station_id")
      .eq("id", user.id)
      .single()
    if (!profile?.health_station_id) return { mapData: null, station: null }

    const [stationResult, stationInfo] = await Promise.all([
      supabase
        .from("health_stations")
        .select("id, name, latitude, longitude, physical_city_barangay_id")
        .eq("id", profile.health_station_id)
        .single(),
      this.getStationInfo(),
    ])

    const station = stationResult.data
    const targetBarangayId = cityBarangayId ?? station?.physical_city_barangay_id
    if (!targetBarangayId) return { mapData: null, station: stationInfo }

    const boundary = await this.getBarangayBoundary(targetBarangayId)

    return { mapData: boundary ?? null, station: stationInfo }
  },
}
