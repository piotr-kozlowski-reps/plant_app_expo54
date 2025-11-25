import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const GreenhouseCropsOrderToSpacingPage = () => {
  return (
    <>
      <AllCropsOrdersAllEntryPage whatOrderType="greenhouse_crops_works_order_to_spacing" />
    </>
  );
};

export default GreenhouseCropsOrderToSpacingPage;
