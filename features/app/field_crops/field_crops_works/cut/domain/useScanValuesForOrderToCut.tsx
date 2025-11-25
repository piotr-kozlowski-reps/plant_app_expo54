import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { ZpToCut } from "@/features/shared/types/interfaces-cut";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { useState } from "react";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useAllowScanOnlyZpOrTray } from "@/features/shared/utils/useAllowScanOnlyZpOrTray";

export const useScanValuesForOrderToCut = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cutsList: ZpToCut[]
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureZPValue, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { renderDateInPolishWay } = useDatesHelper();

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
        if (foundZP.plndat) {
          toast.warning(
            `${
              ERROR_MESSAGES.ZP_WAS_ALREADY_ORDERED_TO_CUT
            } ${renderDateInPolishWay(foundZP.plndat)}.`
          );
          return;
        }

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

  //hook return
  return {
    qrLock,
    scannedValue,
    setQrLock,
    scanValueHandler,
  };
};
