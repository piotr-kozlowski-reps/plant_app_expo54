import TrayOperationsDisconnectFromZpEntryPage from "@/features/app/field_crops/tray_operations/disconnect_from_zp/ui/TrayOperationsDisconnectFromZpEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsDisconnectFromZpPage = () => {
  return (
    <>
      <TrayOperationsDisconnectFromZpEntryPage />
    </>
  );
};

export default TrayOperationsDisconnectFromZpPage;
