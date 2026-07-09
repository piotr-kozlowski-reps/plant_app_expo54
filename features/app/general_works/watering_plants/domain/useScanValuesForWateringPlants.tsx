import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetLocalizationInfo_Report1580 } from "@/features/shared/data-access/useGetLocalizationInfo_Report1580";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { Localization } from "@/features/shared/types/interfaces-localization";

export const useScanValuesForWateringPlants = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { checkWhatValueWasScanned, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { getLocalizationInfoInfo_Report1580 } =
    useGetLocalizationInfo_Report1580();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<Localization | null>(null);
  const [scannedRawValue, setScannedRawValue] = useState<string | null>(null);

  /**
   * @public
   * @procedureItem
   * @order 30
   * skan QR lokalizacji
   */
  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    if (whatValueWasScanned === "unknown") {
      const warningMessage = `Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`;
      toast.warning(warningMessage, { id: warningMessage });
      return;
    }
    if (whatValueWasScanned !== "field") {
      toast.warning(ERROR_MESSAGES.ONLY_FIELD_AVAILABLE, {
        id: ERROR_MESSAGES.ONLY_FIELD_AVAILABLE,
      });
      return;
    }

    try {
      setIsLoading(true);

      /**
       * @public
       * @procedureItem
       * raporty:
       * @readFile `features/shared/data-access/useGetLocalizationInfo_Report1580.tsx`
       */

      const fieldName = getPureFieldValue(scannedValue);
      const localizationInfo = await getLocalizationInfoInfo_Report1580(
        token!,
        fieldName,
        errorHandler,
      );

      if (!localizationInfo) {
        toast.warning(ERROR_MESSAGES.LOCALIZATION_NOT_FOUND, {
          id: ERROR_MESSAGES.LOCALIZATION_NOT_FOUND,
        });
        return;
      }

      setScannedRawValue(scannedValue);
      setScannedValue(localizationInfo);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetScannedValue = () => {
    setScannedValue(null);
  };

  //hook return
  return {
    qrLock,
    scannedValue,
    scannedRawValue,
    setQrLock,
    scanValueHandler,
    resetScannedValue,
  };
};
