import FieldCropsEntryPage from "@/features/app/field_crops/ui/FieldCropsEntryPage";
import GreenhouseCropsEntryPage from "@/features/app/greenhouse_crops/ui/GreenhouseCropsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsPage = () => {
  return (
    <>
      <GreenhouseCropsEntryPage />
    </>
  );
};

export default GreenhouseCropsPage;
