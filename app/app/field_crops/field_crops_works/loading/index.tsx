import FieldCropsInternalTransportEntryPage from "@/features/app/all_crops/internal_transport/ui/AllCropsInternalTransportEntryPage";
import FieldCropsLoadingEntryPage from "@/features/app/field_crops/field_crops_works/loading/ui/FieldCropsLoadingEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsLoadingPage = () => {
  return (
    <>
      <FieldCropsLoadingEntryPage />
    </>
  );
};

export default FieldCropsLoadingPage;
