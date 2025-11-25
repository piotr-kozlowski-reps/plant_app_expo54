import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import * as Haptics from "expo-haptics";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { ZpToCut } from "@/features/shared/types/interfaces-cut";
import { useAllowScanOnlyZpOrTray } from "@/features/shared/utils/useAllowScanOnlyZpOrTray";

export const useScanValuesForCutGRU = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cutsList: ZpToCut[]
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZPShortenedInfo | null>(
    null
  );

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const { isZP, isTray, isNoZpOrTray, whatValueWasScanned } =
      useAllowScanOnlyZpOrTray(scannedValue);
    if (isNoZpOrTray) return;

    try {
      setIsLoading(true);

      //allowed conditions
      if (isZP || isTray) {
        const foundZP = await scanZpOrTrayRep113(
          scannedValue,
          whatValueWasScanned
        );
        if (!foundZP) return;

        /** guards */
        //Zp not in list of ZPes ordered to cut - disabled
        // const ordnmb = foundZP.ordnmb;
        // if (!cutsList.find((cut) => cut.ordnmb === ordnmb)) {
        //   toast.warning(ERROR_MESSAGES.CANNOT_CONFIRM_ZP_WAS_NOT_ORDERED);
        //   return;
        // }

        //mapping
        const ZPInfo: ZPShortenedInfo = {
          ordnmb: foundZP.ordnmb,
          sordid: foundZP.ordid_,
          twrnzw: foundZP.twrnzw,
          stkcnt: foundZP.stkcnt,
          scanned_raw_value: scannedValue,
        };

        setScannedValue(ZPInfo);

        return;
      }

      throw new Error(
        "useScanValuesForCutGRU -> scanValueHandler - condition not implemented."
      );
    } catch (error) {
      console.error(error);
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
