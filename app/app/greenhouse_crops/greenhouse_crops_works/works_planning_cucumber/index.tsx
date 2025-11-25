import GreenhouseCropsWorksPlanningEntryPage from "@/features/app/greenhouse_crops/greenhouse_crops_works/works_planning/ui/GreenhouseCropsWorksPlanningEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";
export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsWorksPlanningCucumberPage = () => {
  ////tsx
  return (
    <>
      <GreenhouseCropsWorksPlanningEntryPage variant="greenhouse_crops_works_works_planning_cucumber" />
    </>
  );
};

export default GreenhouseCropsWorksPlanningCucumberPage;
