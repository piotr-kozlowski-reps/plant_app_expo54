// // import { AllCropsOrdersSubmodules } from "../types/interfaces-auth";

import { AllExportToCustomerSubmodules } from "@/features/shared/types/interfaces-auth";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  GREENHOUSE_CROPS,
  GREENHOUSE_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";

// import { AllInternalTransportSubmodules } from "../types/interfaces-auth";

export const useGetAppPathForOrderExportToCustomer = () => {
  const getAppPathForOrderExportToCustomer = (
    submoduleName: string,
    whatOrderType: AllExportToCustomerSubmodules
  ) => {
    const basePath = getBasePath(whatOrderType);
    return (
      <AppPath
        paths={[...basePath, { actionFn: () => {}, name: submoduleName }]}
      />
    );
  };
  function getBasePath(submoduleName: AllExportToCustomerSubmodules) {
    if (submoduleName === "greenhouse_crops_works_order_export_to_customer")
      return [INDEX, GREENHOUSE_CROPS, GREENHOUSE_CROPS_WORKS];
    return [INDEX, FIELD_CROPS, FIELD_CROPS_WORKS];
  }

  ////hook return
  return { getAppPathForOrderExportToCustomer };
};
