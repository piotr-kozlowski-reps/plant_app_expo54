import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import GeneralWorksWateringPlantsEntryPage from "@/features/app/general_works/watering_plants/ui/GeneralWorksWateringPlantsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GeneralWorksWateringPlantsPage = () => {
  return (
    <>
      <GeneralWorksWateringPlantsEntryPage />
    </>
  );
};

export default GeneralWorksWateringPlantsPage;
