import PottedPlantsZP_EntryPage from "@/features/app/potted_plants/potted_plants_zp/ui/PottedPlantsZP_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsZP_Page = () => {
  ////tsx
  return (
    <>
      <PottedPlantsZP_EntryPage />
    </>
  );
};

export default PottedPlantsZP_Page;
