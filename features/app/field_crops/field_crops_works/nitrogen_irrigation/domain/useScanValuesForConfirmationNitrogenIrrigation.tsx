import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";

export const useScanValuesForConfirmationNitrogenIrrigation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZPShortenedInfo | null>(
    null,
  );

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const isScannedDataCorrect = checkIsScannedDataCorrect(scannedValue, [
      "tray",
      "zp_gru",
    ]);
    if (!isScannedDataCorrect) return;

    try {
      setIsLoading(true);

      const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
      const foundZP = await scanZpOrTrayRep113(
        scannedValue,
        whatValueWasScanned,
      );
      if (!foundZP) return;

      //mapping
      const ZPInfo: ZPShortenedInfo = {
        ordnmb: foundZP.ordnmb,
        sordid: foundZP.ordid_,
        twrnzw: foundZP.twrnzw,
        stkcnt: foundZP.stkcnt,
        scanned_raw_value: scannedValue,
      };

      setScannedValue(ZPInfo);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllData = () => {
    setScannedValue(null);
  };

  //hook return
  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
    refreshAllData,
  };
};
