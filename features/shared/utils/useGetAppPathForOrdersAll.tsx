import { AllCropsOrdersSubmodules } from "../types/interfaces-auth";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  GREENHOUSE_CROPS,
  GREENHOUSE_CROPS_WORKS,
  INDEX,
} from "../types/interfaces-navigation";
import AppPath from "../ui/app-path/AppPath";

export const useGetAppPathForOrdersAll = () => {
  const getAppPathForOrdersAll = (
    submoduleName: string,
    whatOrderType: AllCropsOrdersSubmodules
  ) => {
    const basePath = getBasePath(whatOrderType);

    return (
      <AppPath
        paths={[...basePath, { actionFn: () => {}, name: submoduleName }]}
      />
    );
  };

  function getBasePath(whatOrderType: AllCropsOrdersSubmodules) {
    if (whatOrderType === "greenhouse_crops_works_order_to_spacing")
      return [INDEX, GREENHOUSE_CROPS, GREENHOUSE_CROPS_WORKS];
    return [INDEX, FIELD_CROPS, FIELD_CROPS_WORKS];
  }

  ////hook return
  return { getAppPathForOrdersAll };
};
