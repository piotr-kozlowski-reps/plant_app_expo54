import PottedPlantsQuantity_EntryPage from "@/features/app/potted_plants/potted_plants_quantity/ui/PottedPlantsQuantity_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsQuantity_Page = () => {
  ////tsx
  return (
    <>
      <PottedPlantsQuantity_EntryPage />
    </>
  );
};

export default PottedPlantsQuantity_Page;
