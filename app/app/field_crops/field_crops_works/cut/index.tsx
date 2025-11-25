import FieldCropsCutEntryPage from "@/features/app/field_crops/field_crops_works/cut/ui/FieldCropsCutEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsCutPage = () => {
  return (
    <>
      <FieldCropsCutEntryPage />
    </>
  );
};

export default FieldCropsCutPage;
