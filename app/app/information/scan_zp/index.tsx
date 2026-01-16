import Information_ScanZP_Page_EntryPage from "@/features/app/information/scan_zp/ui/Information_ScanZP_Page_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const Information_ScanZP_Page = () => {
  ////tsx
  return (
    <>
      <Information_ScanZP_Page_EntryPage />
    </>
  );
};

export default Information_ScanZP_Page;
