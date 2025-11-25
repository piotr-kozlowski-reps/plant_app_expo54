import { TrayScannedValueForMovingToGarden } from "../types/interfaces-move_to_garden";
import useAuthSessionStore from "../stores/useAuthSessionStore";

import { ControlSowingChanges } from "../types/interface-control_sowing_changes";
import { useErrorHandler } from "./useErrorHandler";
import { TrayScannedValueForAddToZp } from "../types/interface-add_to_zp";
import { useGetControlSowingChanges_Report119 } from "../data-access/useGetControlSowingChanges_Report119";

export const useGetErrorsFromControlSowingChangesReport = () => {
  ////vars
  const { token } = useAuthSessionStore();
  const { getControlSowingChanges_Report119 } =
    useGetControlSowingChanges_Report119();
  const { errorHandler } = useErrorHandler();

  const getErrorsFromControlSowingChangesReport = async (
    scannedValues:
      | TrayScannedValueForMovingToGarden[]
      | TrayScannedValueForAddToZp[]
  ) => {
    const allPromisesResponses = await Promise.all(
      getAllPromisesFunctions(scannedValues)
    );
    const allErrors = getAllErrors(allPromisesResponses, scannedValues);
    return allErrors;
  };

  //helpers
  function getAllPromisesFunctions(
    scannedValues:
      | TrayScannedValueForMovingToGarden[]
      | TrayScannedValueForAddToZp[]
  ) {
    const allPromisesFunctions: Promise<ControlSowingChanges | null>[] = [];
    scannedValues.forEach((valuesSet) => {
      allPromisesFunctions.push(
        getControlSowingChanges_Report119(
          token!,
          valuesSet.stk_id,
          "",
          valuesSet.ordnmb,
          errorHandler
        )
      );
    });
    return allPromisesFunctions;
  }

  type ErrorSet = {
    scannedValue:
      | TrayScannedValueForMovingToGarden
      | TrayScannedValueForAddToZp;
    errorText: string;
  };
  function getAllErrors(
    allPromisesResponses: (ControlSowingChanges | null)[],
    scannedValues:
      | TrayScannedValueForMovingToGarden[]
      | TrayScannedValueForAddToZp[]
  ): ErrorSet[] {
    const allErrors: ErrorSet[] = [];
    for (let i = 0; i < allPromisesResponses.length; i++) {
      if (allPromisesResponses[i]?.errtxt) {
        allErrors.push({
          scannedValue: scannedValues[i],
          errorText: allPromisesResponses[i]?.errtxt || "",
        });
      }
    }

    return allErrors;
  }

  //hook return
  return {
    getErrorsFromControlSowingChangesReport,
  };
};
