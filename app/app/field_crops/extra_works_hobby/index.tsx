import ExtraWorksHobbyEntryPage from "@/features/app/field_crops/extra_works_hobby/ui/ExtraWorksHobbyEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksHobbyPage = () => {
  return (
    <>
      <ExtraWorksHobbyEntryPage />
    </>
  );
};

export default ExtraWorksHobbyPage;
