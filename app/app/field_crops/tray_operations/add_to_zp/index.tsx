import TrayOperationsAddToZpEntryPage from "@/features/app/field_crops/tray_operations/add_to_zp/ui/TrayOperationsAddToZpEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsAddToZpPage = () => {
  return (
    <>
      <TrayOperationsAddToZpEntryPage />
    </>
  );
};

export default TrayOperationsAddToZpPage;
