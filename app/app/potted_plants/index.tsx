// import GreenhouseCropsEntryPage from "@/features/app/greenhouse_crops/ui/GreenhouseCropsEntryPage";
import PottedPlantsEntryPage from "@/features/app/potted_plants/ui/PottedPlantsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsPage = () => {
  return (
    <>
      <PottedPlantsEntryPage />
    </>
  );
};

export default PottedPlantsPage;
