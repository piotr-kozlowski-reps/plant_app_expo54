import GlobalErrorPageEntryPage from "@/features/global_error/ui/GlobalErrorPageEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GlobalErrorPage = () => {
  return (
    <>
      <GlobalErrorPageEntryPage />
    </>
  );
};

export default GlobalErrorPage;
