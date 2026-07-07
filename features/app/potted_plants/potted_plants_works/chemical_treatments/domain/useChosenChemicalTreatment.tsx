import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useState } from "react";

export const useChosenChemicalTreatment = () => {
  //states
  const [chemicalTreatmentDon, setChemicalTreatmentDon] =
    useState<ProtectiveTreatment | null>(null);

  //modals
  const [
    isShowModalWithSelectChemicalTreatmentDon,
    setIsShowModalWithSelectChemicalTreatmentDon,
  ] = useState(false);

  //fn
  const resetValuesForChemicalTreatments = () => {
    setChemicalTreatmentDon(null);
  };

  const changeChemicalTreatment = (chemicalTreatment: ProtectiveTreatment) => {
    setChemicalTreatmentDon(chemicalTreatment);
  };

  return {
    chemicalTreatmentDon,
    isShowModalWithSelectChemicalTreatmentDon,

    setIsShowModalWithSelectChemicalTreatmentDon,
    resetValuesForChemicalTreatments,
    changeChemicalTreatment,
  };
};
