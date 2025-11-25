import FieldCropsInternalTransportEntryPage from "@/features/app/all_crops/internal_transport/ui/AllCropsInternalTransportEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";
import { FieldCropsSubmodules } from "../../../../../features/shared/types/interfaces-auth";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const AllCropsInternalTransportEntryPage = () => {
  return (
    <>
      <FieldCropsInternalTransportEntryPage
        submoduleType={"greenhouse_crops_works_internal_transport"}
      />
      {/* <AllCropsOrdersAllEntryPage whatOrderType="greenhouse_crops_works_order_to_spacing" /> */}
    </>
  );
};

export default AllCropsInternalTransportEntryPage;
