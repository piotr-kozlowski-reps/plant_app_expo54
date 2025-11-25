import AllCropsLoadingForecastEntryPage from "@/features/app/all_crops/loading_forecast/ui/AllCropsLoadingForecastEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";
export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsLoadingForecastPage = () => {
  ////tsx
  return (
    <>
      <AllCropsLoadingForecastEntryPage submoduleType="greenhouse_crops_works_loading_forecast" />
    </>
  );
};

export default GreenhouseCropsLoadingForecastPage;
