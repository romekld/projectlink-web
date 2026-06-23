import { NewHouseholdPage } from "@/features/bhw/households/new"
import { mapService } from "@/features/bhw/households/new/services/map-service"

export default async function Page() {
  const mapData = await mapService.getMapData()

  return <NewHouseholdPage mapData={mapData} />
}
