import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useState } from "react";

export const useChosenProtectiveTreatment = () => {
  //states
  const [protectiveTreatment, setProtectiveTreatment] =
    useState<ProtectiveTreatment | null>(null);

  //modals
  const [
    isShowModalWithSelectConcentration,
    setIsShowModalWithSelectConcentration,
  ] = useState(false);

  //fn
  const resetValuesForProtectiveTreatments = () => {
    setProtectiveTreatment(null);
  };

  const changeProtectiveTreatment = (
    protectiveTreatment: ProtectiveTreatment
  ) => {
    setProtectiveTreatment(protectiveTreatment);
  };

  return {
    protectiveTreatment,
    isShowModalWithSelectConcentration,

    setIsShowModalWithSelectConcentration,
    resetValuesForProtectiveTreatments,
    changeProtectiveTreatment,
  };
};
