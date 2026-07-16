import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetZPInfo_Packaging } from "@/features/shared/data-access/useGetZPInfo_Packaging";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import {
  ZPPackagingInfo,
  ZPPackagingInfoWithScannedRowValue,
} from "@/features/shared/types/interfaces-zp_packaging";
import { useToastWrapper } from "@/features/shared/utils/useToastWrapper";

export const useScanValuesForPottedPlantsPackaging = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();
  const { errorHandler } = useErrorHandler();
  const { getZPInfo_Packaging } = useGetZPInfo_Packaging();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();
  const { toastWrapper } = useToastWrapper();

  //values
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] =
    useState<ZPPackagingInfoWithScannedRowValue | null>(null);

  const resetValues = () => {
    setScannedValue(null);
  };

  //fn
  /**
   * @public
   * @procedureItem
   * @order 130
   * skan QR kod: ZP
   */
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * zabezpieczenie: dostępne tylko skanowanie <b>zp_don</b>
     */
    const isScannedDataCorrect = checkIsScannedDataCorrect(scannedValue, [
      "zp_don",
    ]);
    if (!isScannedDataCorrect) return;

    try {
      setIsLoading(true);

      /**
       * @public
       * @procedureItem
       * raporty - konfekcjonowanie - zapytanie o ZP:
       * @readFile `features/shared/data-access/useGetZPInfo_Packaging.tsx`
       */

      const pureZP = getPureZPValue(scannedValue);
      const foundZP = await getZPInfo_Packaging(pureZP);

      if (!foundZP) return;

      /**
       * @public
       * @guard
       * zabezpieczenie: jeżeli isdone jest na <b>true</b> to znaczy, ze zlecenie było juz konfekcjonowanie
       * -> info i koniec procedury
       */
      if (foundZP.isdone) {
        toastWrapper(`Zlecenie  ${foundZP.ordnmb} było już wykonane.`, "error");
        return;
      }

      setScannedValue({ ...foundZP, scanned_raw_value: scannedValue });
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
    resetValues,
  };
};
