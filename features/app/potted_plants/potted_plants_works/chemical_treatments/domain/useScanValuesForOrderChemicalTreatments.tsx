import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";

export const useScanValuesForOrderChemicalTreatments = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);

  //values
  const [qrLock, setQrLock] = useState(true);
  const [isFieldScanned, setIsFieldScanned] = useState(false);
  const [isZPScanned, setIsZPScanned] = useState(false);
  const [scannedValues, setScannedValues] = useState<
    ZPShortenedInfoWithoutTwrnzw[]
  >([]);

  //derived values

  //fn
  /**
   * @public
   * @procedureItem
   * @order 130
   * skan QR kod: lokalizacja lub ZP
   */
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();
  };

  return {
    qrLock,
    isFieldScanned,

    setQrLock,
    scanValueHandler,
  };
};
