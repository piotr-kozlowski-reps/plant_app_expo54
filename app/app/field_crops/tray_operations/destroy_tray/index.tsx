import TrayOperationsDestroyTrayEntryPage from "@/features/app/field_crops/tray_operations/destroy_tray/ui/FieldCropsDestroyTrayEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsDestroyTrayPage = () => {
  return (
    <>
      <TrayOperationsDestroyTrayEntryPage />
    </>
  );
};

export default TrayOperationsDestroyTrayPage;
