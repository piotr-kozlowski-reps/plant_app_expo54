import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useMemo } from "react";

export const useNitrogenProtectiveTreatmentsHelpers = () => {
  const filterOnlyNitrogenProtectiveTreatments = (
    protectiveTreatments: ProtectiveTreatment[]
  ): ProtectiveTreatment[] => {
    const protectiveTreatmentsFiltered = useMemo(() => {
      return protectiveTreatments.filter(
        (protectiveTreatment) =>
          protectiveTreatment.params !== null &&
          protectiveTreatment.params.nitrogen
      );
    }, [protectiveTreatments]);

    return protectiveTreatmentsFiltered;
  };

  return { filterOnlyNitrogenProtectiveTreatments };
};
