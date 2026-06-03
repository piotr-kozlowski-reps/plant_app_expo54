import { ZpRozActivityDetails } from "@/features/shared/types/interfaces-activities_list";

export const useFindMaterialWithDoni = () => {
  const findMaterialWithDoni = (activityDetails: ZpRozActivityDetails[]) => {
    const foundMaterialWithDoni = activityDetails.find((material) =>
      material.twr_kod.startsWith("DONI."),
    );
    return foundMaterialWithDoni;
  };

  ////hook return
  return { findMaterialWithDoni };
};
