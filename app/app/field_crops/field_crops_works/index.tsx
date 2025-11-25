import FieldCropsEntryPage from "@/features/app/field_crops/field_crops_works/ui/FieldCropsEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsPage = () => {
  return (
    <>
      <FieldCropsEntryPage />
    </>
  );
};

export default FieldCropsPage;
