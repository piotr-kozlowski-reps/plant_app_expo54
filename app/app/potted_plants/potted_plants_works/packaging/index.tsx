// import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import PottedPlantsPackagingEntryPage from "@/features/app/potted_plants/potted_plants_works/packaging/ui/PottedPlantsPackagingEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsPackagingPage = () => {
  return (
    <>
      <PottedPlantsPackagingEntryPage />
    </>
  );
};

export default PottedPlantsPackagingPage;
