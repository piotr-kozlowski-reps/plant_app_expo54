import { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import * as Haptics from "expo-haptics";

export const useScannedValuesForPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);

  /** state */
  //scanner
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<unknown>("sdfsd");

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();
  };

  ////return
  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
  };
};
