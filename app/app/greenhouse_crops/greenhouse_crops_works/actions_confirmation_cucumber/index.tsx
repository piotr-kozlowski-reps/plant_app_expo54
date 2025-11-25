import GreenhouseCropsActionsConfirmationEntryPage from "@/features/app/greenhouse_crops/greenhouse_crops_works/actions_confirmation/ui/GreenhouseCropsActionsConfirmationEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsActionsConfirmationCucumberPage = () => {
  ////tsx
  return (
    <>
      <GreenhouseCropsActionsConfirmationEntryPage
        variant={"greenhouse_crops_works_activity_confirmation_cucumber"}
      />
    </>
  );
};

export default GreenhouseCropsActionsConfirmationCucumberPage;
