import AllCropsInternalTransportEntryPage from "@/features/app/all_crops/internal_transport/ui/AllCropsInternalTransportEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlants_PottedPlantsWorks_InternalTransportPage = () => {
  return (
    <>
      <AllCropsInternalTransportEntryPage submoduleType="potted_plants_works_internal_transport" />
    </>
  );
};

export default PottedPlants_PottedPlantsWorks_InternalTransportPage;
