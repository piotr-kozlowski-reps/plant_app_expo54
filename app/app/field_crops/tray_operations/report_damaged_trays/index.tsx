import FieldCropsReportDamagedTraysEntryPage from "@/features/app/field_crops/tray_operations/report_damaged_trays/ui/FieldCropsReportDamagedTraysEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const TrayOperationsReportDamagedTraysPage = () => {
  return (
    <>
      <FieldCropsReportDamagedTraysEntryPage />
    </>
  );
};

export default TrayOperationsReportDamagedTraysPage;
