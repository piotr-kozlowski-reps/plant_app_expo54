import InformationEntryPage from "@/features/app/information/ui/InformationEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const AnalysisPage = () => {
  return (
    <>
      <InformationEntryPage />
    </>
  );
};

export default AnalysisPage;
