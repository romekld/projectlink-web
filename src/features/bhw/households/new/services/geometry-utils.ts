export function computeCentroid(geometry: GeoJSON.Geometry): { lng: number; lat: number } | null {
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
