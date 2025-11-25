import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "./messages";
import { useCheckWhatValueIsScannedHelpers } from "./useCheckWhatValueIsScannedHelpers";

import useAuthSessionStore from "../stores/useAuthSessionStore";
import { useErrorHandler } from "./useErrorHandler";
import {
  ZPInLocalizationInfo,
  ZPShortenedInfoWithoutTwrnzw,
} from "../types/interfaces-zp";
import { useGetZPsPerLocalization_Report123 } from "../data-access/useGetZPsPerLocalization_Report123";

export const useScanHelpers = () => {
  ////vars
  const { getPureFieldValue } = useCheckWhatValueIsScannedHelpers();
  const { getZPsPerLocalization_Report123 } =
    useGetZPsPerLocalization_Report123();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  ////fn
  function checkIfValueIsAlreadyScanned<T extends { ordnmb: string }>(
    scannedOrdnmb: string,
    scannedValues: T[]
  ) {
    if (!scannedOrdnmb) return false;

    const scannedZpValues: string[] = scannedValues.map((item) => item.ordnmb);
    return scannedZpValues.includes(scannedOrdnmb);
  }

  type GuardCallbackFn = (
    foundZPsPerLocalization: ZPInLocalizationInfo[]
  ) => boolean;
  type FilterCallbackFn = (
    foundZPsPerLocalization: ZPInLocalizationInfo[]
  ) => ZPInLocalizationInfo[];
  type ScanField = {
    scannedValue: string;
    isZPScanned: boolean;
    warning_message: string;
    setIsFieldScanned: React.Dispatch<React.SetStateAction<boolean>>;
    setScannedValues: React.Dispatch<
      React.SetStateAction<ZPShortenedInfoWithoutTwrnzw[]>
    >;
    isToFilterByMvplok: boolean;
    callbacksGuards: GuardCallbackFn[];
    callbacksFilters: FilterCallbackFn[];
  };

  async function scanField(scanFieldObject: ScanField) {
    {
      const {
        isToFilterByMvplok,
        isZPScanned,
        scannedValue,
        setIsFieldScanned,
        setScannedValues,
        warning_message,
        callbacksGuards,
        callbacksFilters,
      } = scanFieldObject;

      if (isZPScanned) {
        toast.warning(ERROR_MESSAGES.CANNOT_SCAN_FIELD_WHEN_ZP_SCANNED_EARLIER);
        return;
      }

      const scannedField = getPureFieldValue(scannedValue);

      //fetch field ZPSelected
      const foundZPsPerLocalization = await getZPsPerLocalization_Report123(
        token!,
        scannedField,
        errorHandler
      );

      if (!foundZPsPerLocalization) {
        return;
      }

      /** guards */
      //all callbacks check
      for (const callback of callbacksGuards) {
        const callbacksGuardDidPass = callback(foundZPsPerLocalization);
        if (!callbacksGuardDidPass) {
          return;
        }
      }

      /** filters */
      let filteredZpInLocalization: ZPInLocalizationInfo[] = [
        ...foundZPsPerLocalization,
      ];
      for (const callback of callbacksFilters) {
        const filtrationResult = callback(filteredZpInLocalization);
        filteredZpInLocalization = filtrationResult;
      }

      const ZPsInLocalization: ZPShortenedInfoWithoutTwrnzw[] =
        filteredZpInLocalization
          .filter((zp) => {
            if (isToFilterByMvplok) {
              return zp.mvplok === true;
            }
            return zp;
          })
          .map((zp) => ({
            ordnmb: zp.ordnmb,
            sordid: zp.sordid,
            stkcnt: zp.stkcnt,
            scanned_raw_value: scannedValue,
          }));

      if (ZPsInLocalization.length) {
        setIsFieldScanned(true);
        setScannedValues(ZPsInLocalization);
        return;
      }

      toast.warning(warning_message);
    }
  }

  return { checkIfValueIsAlreadyScanned, scanField };
};
