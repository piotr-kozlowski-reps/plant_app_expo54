// import { AllCropsOrdersSubmodules } from "../types/interfaces-auth";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  GREENHOUSE_CROPS,
  GREENHOUSE_CROPS_WORKS,
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
} from "../types/interfaces-navigation";

import { AllInternalTransportSubmodules } from "../types/interfaces-auth";
import AppPath from "../ui/app-path/AppPath";

export const useGetAppPathForInternalTransportAll = () => {
  const getAppPathForInternalTransportAll = (
    submoduleName: string,
    whatOrderType: AllInternalTransportSubmodules,
  ) => {
    const basePath = getBasePath(whatOrderType);
    return (
      <AppPath
        paths={[...basePath, { actionFn: () => {}, name: submoduleName }]}
      />
    );
  };

  function getBasePath(whatOrderType: AllInternalTransportSubmodules) {
    if (whatOrderType === "field_crops_works_internal_transport")
      return [INDEX, FIELD_CROPS, FIELD_CROPS_WORKS];

    if (whatOrderType === "greenhouse_crops_works_internal_transport")
      return [INDEX, GREENHOUSE_CROPS, GREENHOUSE_CROPS_WORKS];

    if (whatOrderType === "potted_plants_works_internal_transport")
      return [INDEX, POTTED_PLANTS, POTTED_PLANTS_WORKS];

    throw new Error("getBasePath -> whatOrderType is not valid");
  }

  ////hook return
  return { getAppPathForInternalTransportAll };
};
