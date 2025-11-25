import GeneralWorksEntryPage from "@/features/app/general_works/ui/GeneralWorksEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GeneralWorksPage = () => {
  return (
    <>
      <GeneralWorksEntryPage />
    </>
  );
};

export default GeneralWorksPage;
