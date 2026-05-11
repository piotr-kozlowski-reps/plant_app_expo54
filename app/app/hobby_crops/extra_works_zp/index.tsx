import ExtraWorksZpEntryPage from "@/features/app/field_crops/extra_works_zp/ui/ExtraWorksZpEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksHobbyZpPage = () => {
  return (
    <>
      <ExtraWorksZpEntryPage isHobby={true} />
    </>
  );
};

export default ExtraWorksHobbyZpPage;
