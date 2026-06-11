import PottedPlantsTrayOperationsEntryPage from "@/features/app/potted_plants/potted_plants_tray_operations/ui/PottedPlantsTrayOperationsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsTrayOperationsPage = () => {
  return (
    <>
      <PottedPlantsTrayOperationsEntryPage />
    </>
  );
};

export default PottedPlantsTrayOperationsPage;
