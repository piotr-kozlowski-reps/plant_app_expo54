import TrayOperationsMoveToGardenEntryPage from "@/features/app/field_crops/tray_operations/move_to_garden/ui/TrayOperationsMoveToGardenEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsMoveToGardenPage = () => {
  return (
    <>
      <TrayOperationsMoveToGardenEntryPage />
    </>
  );
};

export default TrayOperationsMoveToGardenPage;
