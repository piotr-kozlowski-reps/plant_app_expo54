// import PottedPlantsZP_EntryPage from "@/features/app/potted_plants/potted_plants_zp/ui/PottedPlantsZP_EntryPage";
import PottedPlantsPotting_EntryPage from "@/features/app/potted_plants/potted_plants_potting/ui/PottedPlantsPotting_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsPotting_Page = () => {
  ////tsx
  return (
    <>
      <PottedPlantsPotting_EntryPage />
    </>
  );
};

export default PottedPlantsPotting_Page;
