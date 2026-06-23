import { Suspense } from "react"
import { NewHouseholdPage, NewHouseholdPageSkeleton } from "@/features/bhw/households/new"
import { mapService } from "@/features/bhw/households/new/services/map-service"

async function NewHouseholdLoader() {
  const [coverageBarangays, station] = await Promise.all([
    mapService.getCoverageBarangays(),
    mapService.getStationInfo(),
  ])

  const primary = coverageBarangays.find((b) => b.isPrimary) ?? coverageBarangays[0]
  const initialMapData = primary
    ? await mapService.getBarangayBoundary(primary.cityBarangayId)
    : null

  return (
    <NewHouseholdPage
      coverageBarangays={coverageBarangays}
      initialMapData={initialMapData}
      station={station}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={<NewHouseholdPageSkeleton />}>
      <NewHouseholdLoader />
    </Suspense>
  )
}
