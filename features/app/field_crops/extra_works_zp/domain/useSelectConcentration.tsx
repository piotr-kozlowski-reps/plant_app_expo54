import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useState } from "react";

export const useSelectConcentration = () => {
  /** vars */
  //state
  const [selectedProtectiveTreatment, setSelectedProtectiveTreatment] =
    useState<ProtectiveTreatment | null>(null);

  //modals
  const [
    isShowModalWithSelectConcentration,
    setIsShowModalWithSelectConcentration,
  ] = useState(false);

  /** functions */
  const changeProtectiveTreatment = (
    protectiveTreatment: ProtectiveTreatment
  ) => {
    setSelectedProtectiveTreatment(protectiveTreatment);
  };

  return {
    isShowModalWithSelectConcentration,
    selectedProtectiveTreatment,

    setIsShowModalWithSelectConcentration,
    changeProtectiveTreatment,
  };
};
