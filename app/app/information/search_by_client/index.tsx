import Information_SearchByClient_Page_EntryPage from "@/features/app/information/search_by_client/ui/Information_SearchByClient_Page_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const Information_SearchByClient_Page = () => {
  ////tsx
  return (
    <>
      <Information_SearchByClient_Page_EntryPage />
    </>
  );
};

export default Information_SearchByClient_Page;
