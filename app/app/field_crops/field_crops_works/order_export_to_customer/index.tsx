import AllCropsOrderExportToCustomerEntryPage from "@/features/app/all_crops/order_export_to_customer/ui/AllCropsOrderExportToCustomerEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const FieldCropsOrderExportToCustomerPage = () => {
  return (
    <>
      <AllCropsOrderExportToCustomerEntryPage submoduleType="field_crops_works_order_export_to_customer" />
    </>
  );
};

export default FieldCropsOrderExportToCustomerPage;
