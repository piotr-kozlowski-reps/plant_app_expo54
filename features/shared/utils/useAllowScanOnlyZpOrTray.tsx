import { toast } from "sonner-native";
import { useCheckWhatValueIsScannedHelpers } from "./useCheckWhatValueIsScannedHelpers";
import { ERROR_MESSAGES } from "./messages";

export const useAllowScanOnlyZpOrTray = (scannedValue: string) => {
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();

  const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
  if (whatValueWasScanned === "unknown") {
    toast.warning(`Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`);
  }
  if (whatValueWasScanned === "field") {
    toast.warning(ERROR_MESSAGES.NO_FIELD_POSSIBLE);
  }
  const isZP = whatValueWasScanned === "zp_gru";
  const isTray = whatValueWasScanned === "tray";
  const isNoZpOrTray = !isZP && !isTray;

  return { whatValueWasScanned, isZP, isTray, isNoZpOrTray };
};
