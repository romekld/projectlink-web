import { createClient } from "@/lib/supabase/server"

export interface MapData {
  area: GeoJSON.FeatureCollection
  centroid: { lng: number; lat: number }
  station: {
    id: string
    name: string
    lng: number
    lat: number
  } | null
}

function computeCentroid(geometry: GeoJSON.Geometry): { lng: number; lat: number } | null {
  if (geometry.type === "Polygon") {
    const ring = (geometry as GeoJSON.Polygon).coordinates[0]
    let sumLng = 0, sumLat = 0
    for (const coord of ring) {
      sumLng += coord[0]
      sumLat += coord[1]
    }
    return { lng: sumLng / ring.length, lat: sumLat / ring.length }
  }
  if (geometry.type === "MultiPolygon") {
    const coords = (geometry as GeoJSON.MultiPolygon).coordinates
    let sumLng = 0, sumLat = 0, count = 0
    for (const polygon of coords) {
      for (const coord of polygon[0]) {
        sumLng += coord[0]
        sumLat += coord[1]
        count++
      }
    }
    return count > 0 ? { lng: sumLng / count, lat: sumLat / count } : null
  }
  return null
}

export const mapService = {
  async getMapData(): Promise<MapData | null> {
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
      .select("id, name, latitude, longitude, physical_city_barangay_id")
      .eq("id", profile.health_station_id)
      .single()
    if (!station?.physical_city_barangay_id) return null

    const { data: cityBarangay } = await supabase
      .from("city_barangays")
      .select("geometry, name")
      .eq("id", station.physical_city_barangay_id)
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

    return {
      area,
      centroid,
      station: station.latitude && station.longitude
        ? {
            id: station.id,
            name: station.name,
            lng: station.longitude,
            lat: station.latitude,
          }
        : null,
    }
  },
}
