import FieldCropsReplacementTrayEntryPage from "@/features/app/field_crops/tray_operations/replacement_tray/ui/FieldCropsReplacementTrayEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsReplacementTrayPage = () => {
  return (
    <>
      <FieldCropsReplacementTrayEntryPage />
    </>
  );
};

export default TrayOperationsReplacementTrayPage;
