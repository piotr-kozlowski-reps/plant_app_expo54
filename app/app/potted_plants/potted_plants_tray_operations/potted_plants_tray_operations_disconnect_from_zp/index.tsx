import PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_EntryPage from "@/features/app/potted_plants/potted_plants_tray_operations/potted_plants_tray_operations_disconnect_from_zp/ui/PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_Page = () => {
  return (
    <>
      <PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_EntryPage />
    </>
  );
};

export default PottedPlants_PottedPlantsTrayOperations_DisconnectFromZp_Page;
