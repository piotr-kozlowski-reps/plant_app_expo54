import AllCropsInternalTransportEntryPage from "@/features/app/all_crops/internal_transport/ui/AllCropsInternalTransportEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsInternalTransportEntryPage = () => {
  return (
    <>
      <AllCropsInternalTransportEntryPage
        submoduleType={"greenhouse_crops_works_internal_transport"}
      />
    </>
  );
};

export default GreenhouseCropsInternalTransportEntryPage;
