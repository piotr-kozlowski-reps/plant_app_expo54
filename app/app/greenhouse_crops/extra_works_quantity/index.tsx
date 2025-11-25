import ExtraWorksQuantity_GreenhouseCrops_EntryPage from "@/features/app/greenhouse_crops/extra_works_quantity/ui/ExtraWorksQuantity_GreenhouseCrops_EntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const ExtraWorksQuantity_GreenhouseCrops_Page = () => {
  ////tsx
  return (
    <>
      <ExtraWorksQuantity_GreenhouseCrops_EntryPage />
    </>
  );
};

export default ExtraWorksQuantity_GreenhouseCrops_Page;
