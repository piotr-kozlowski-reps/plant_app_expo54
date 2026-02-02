import { toast } from "sonner-native";
import { TypeOfScannedValue } from "../types/interfaces-general";
import { useCheckWhatValueIsScannedHelpers } from "./useCheckWhatValueIsScannedHelpers";
import { ERROR_MESSAGES } from "./messages";

export const useGuard_CheckDataToBeScanned_ReturnFunction = () => {
  ////vars
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();

  const checkIsScannedDataCorrect = (
    scannedValue: string,
    typesOfAllowedValues: TypeOfScannedValue[],
  ): boolean => {
    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    if (typesOfAllowedValues.includes(whatValueWasScanned)) {
      return true;
    }
    //info for user
    if (whatValueWasScanned === "unknown") {
      toast.warning(`Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`);
    }
    if (whatValueWasScanned === "field") {
      toast.warning(ERROR_MESSAGES.NO_FIELD_POSSIBLE);
    }
    if (whatValueWasScanned === "zp_roz") {
      toast.warning(ERROR_MESSAGES.NO_ZP_ROZ_POSSIBLE);
    }
    if (whatValueWasScanned === "zp_gru") {
      toast.warning(ERROR_MESSAGES.NO_ZP_GRU_POSSIBLE);
    }
    if (whatValueWasScanned === "tray") {
      toast.warning(ERROR_MESSAGES.NO_TRAY_POSSIBLE);
    }
    return false;
  };

  return { checkIsScannedDataCorrect };
};
