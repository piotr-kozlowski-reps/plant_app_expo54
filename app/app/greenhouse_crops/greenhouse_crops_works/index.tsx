import GreenhouseCropsWorksEntryPage from "@/features/app/greenhouse_crops/greenhouse_crops_works/index/ui/GreenhouseCropsWorksEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsWorksPage = () => {
  return (
    <>
      <GreenhouseCropsWorksEntryPage />
    </>
  );
};

export default GreenhouseCropsWorksPage;
