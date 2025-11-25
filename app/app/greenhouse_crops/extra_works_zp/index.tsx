import ExtraWorksZp_GreenhouseCrops_EntryPage from "@/features/app/greenhouse_crops/extra_works_zp/ui/ExtraWorksZp_GreenhouseCrops_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksZp_GreenhouseCrops_Page = () => {
  ////tsx
  return (
    <>
      <ExtraWorksZp_GreenhouseCrops_EntryPage />
    </>
  );
};

export default ExtraWorksZp_GreenhouseCrops_Page;
