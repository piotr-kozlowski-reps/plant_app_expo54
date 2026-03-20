import ExtraWorksHobbyTechnologyEntryPage from "@/features/app/field_crops/extra_works_hobby/extra_works_hobby_technology/ui/ExtraWorksHobbyTechnologyEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksHobbyTechnologyPage = () => {
  return (
    <>
      <ExtraWorksHobbyTechnologyEntryPage />
    </>
  );
};

export default ExtraWorksHobbyTechnologyPage;
