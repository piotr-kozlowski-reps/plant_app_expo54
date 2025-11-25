import FieldCropsNitrogenIrrigationEntryPage from "@/features/app/field_crops/field_crops_works/nitrogen_irrigation/ui/FieldCropsNitrogenIrrigationEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsOrderNitrogenIrrigationPage = () => {
  return (
    <>
      <FieldCropsNitrogenIrrigationEntryPage />
    </>
  );
};

export default FieldCropsOrderNitrogenIrrigationPage;
