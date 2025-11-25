import TrayOperationsEntryPage from "@/features/app/field_crops/tray_operations/ui/TrayOperationsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsPage = () => {
  return (
    <>
      <TrayOperationsEntryPage />
    </>
  );
};

export default TrayOperationsPage;
