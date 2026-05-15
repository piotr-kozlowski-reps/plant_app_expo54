import PottedPlantsWorks_EntryPage from "@/features/app/potted_plants/potted_plants_works/ui/PottedPlantsWorks_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsWorks_Page = () => {
  ////tsx
  return (
    <>
      <PottedPlantsWorks_EntryPage />
    </>
  );
};

export default PottedPlantsWorks_Page;
