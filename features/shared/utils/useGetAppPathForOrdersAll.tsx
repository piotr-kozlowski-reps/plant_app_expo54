import { AllCropsOrdersSubmodules } from "../types/interfaces-auth";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  GREENHOUSE_CROPS,
  GREENHOUSE_CROPS_WORKS,
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
} from "../types/interfaces-navigation";
import AppPath from "../ui/app-path/AppPath";

export const useGetAppPathForOrdersAll = () => {
  const getAppPathForOrdersAll = (
    submoduleName: string,
    whatOrderType: AllCropsOrdersSubmodules,
  ) => {
    const basePath = getBasePath(whatOrderType);

    return (
      <AppPath
        paths={[...basePath, { actionFn: () => {}, name: submoduleName }]}
      />
    );
  };

  function getBasePath(whatOrderType: AllCropsOrdersSubmodules) {
    if (
      whatOrderType === "greenhouse_crops_works_order_to_spacing" ||
      whatOrderType === "greenhouse_crops_works_order_export_to_customer"
    )
      return [INDEX, GREENHOUSE_CROPS, GREENHOUSE_CROPS_WORKS];

    if (whatOrderType === "potted_plants_works_order_to_internal_transport")
      return [INDEX, POTTED_PLANTS, POTTED_PLANTS_WORKS];

    if (
      whatOrderType === "field_crops_works_internal_transport" ||
      whatOrderType === "field_crops_works_order_to_hardener" ||
      whatOrderType === "field_crops_works_order_export_to_customer"
    )
      return [INDEX, FIELD_CROPS, FIELD_CROPS_WORKS];

    throw new Error(
      "useGetAppPathForOrdersAll -> getBasePath -> whatOrderType is not valid",
    );
  }

  ////hook return
  return { getAppPathForOrdersAll };
};
