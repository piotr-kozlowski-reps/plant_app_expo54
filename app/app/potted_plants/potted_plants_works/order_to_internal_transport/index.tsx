import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const PottedPlantsOrderInternalTransportPage = () => {
  return (
    <>
      <AllCropsOrdersAllEntryPage whatOrderType="potted_plants_works_order_to_internal_transport" />
    </>
  );
};

export default PottedPlantsOrderInternalTransportPage;
