import Information_SearchZP_Page_Page_EntryPage from "@/features/app/information/search_zp/ui/Information_SearchZP_Page_Page_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const Information_SearchZP_Page = () => {
  ////tsx
  return (
    <>
      <Information_SearchZP_Page_Page_EntryPage />
    </>
  );
};

export default Information_SearchZP_Page;
