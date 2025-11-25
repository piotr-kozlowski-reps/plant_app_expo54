import FieldCropsPlantsComingUpsCounterEntryPage from "@/features/app/field_crops/field_crops_works/plants_coming_ups_counter/ui/FieldCropsPlantsComingUpsCounterEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsCountingPlantsComingUpsPage = () => {
  return (
    <>
      <FieldCropsPlantsComingUpsCounterEntryPage />
    </>
  );
};

export default FieldCropsCountingPlantsComingUpsPage;
