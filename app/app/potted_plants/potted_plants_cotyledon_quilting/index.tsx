import PottedPlants_CotyledonQuilting_EntryPage from "@/features/app/potted_plants/potted_plants_cotyledon_quilting/ui/PottedPlants_CotyledonQuilting_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlants_CotyledonQuilting_Page = () => {
  ////tsx
  return (
    <>
      <PottedPlants_CotyledonQuilting_EntryPage />
    </>
  );
};

export default PottedPlants_CotyledonQuilting_Page;
