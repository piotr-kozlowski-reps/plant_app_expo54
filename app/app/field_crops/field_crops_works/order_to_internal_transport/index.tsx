import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsOrderInternalTransportPage = () => {
  return (
    <>
      <AllCropsOrdersAllEntryPage whatOrderType="field_crops_works_internal_transport" />
    </>
  );
};

export default FieldCropsOrderInternalTransportPage;
