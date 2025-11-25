import AllCropsOrdersAllEntryPage from "@/features/app/all_crops/orders_all/ui/AllCropsOrdersAllEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsOrderToHardenerPage = () => {
  return (
    <>
      <AllCropsOrdersAllEntryPage whatOrderType="field_crops_works_order_to_hardener" />
    </>
  );
};

export default FieldCropsOrderToHardenerPage;
