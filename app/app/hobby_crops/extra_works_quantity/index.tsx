import ExtraWorksQuantityEntryPage from "@/features/app/field_crops/extra_works_quantity/ui/ExtraWorksQuantityEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksHobbyQuantityPage = () => {
  return (
    <>
      <ExtraWorksQuantityEntryPage isHobby={true} />
    </>
  );
};

export default ExtraWorksHobbyQuantityPage;
