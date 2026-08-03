import PottedPlants_ComingUpsCounter_EntryPage from "@/features/app/potted_plants/potted_plants_works/plants_coming_ups_counter/ui/PottedPlants_ComingUpsCounter_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlants_ComingUpsCounter_Page = () => {
  return (
    <>
      <PottedPlants_ComingUpsCounter_EntryPage />
    </>
  );
};

export default PottedPlants_ComingUpsCounter_Page;
