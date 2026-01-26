import Information_TechnologicalInformation_EntryPage from "@/features/app/information/technological_information/ui/Information_TechnologicalInformation_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const Information_TechnologicalInformation_Page = () => {
  ////tsx
  return (
    <>
      <Information_TechnologicalInformation_EntryPage />
    </>
  );
};

export default Information_TechnologicalInformation_Page;
