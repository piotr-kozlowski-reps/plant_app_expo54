import { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import * as Haptics from "expo-haptics";
import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";

export const useScannedValuesForPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();

  /** state */
  //scanner
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZpScannedValue | null>(null);

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * @order 20
     * zeskanowany ZP'ek musi być z ZPekiem z końcówką 'DON' -> jak nie? koniec procedury.
     */
    const isValueZpDon = checkWhatValueWasScanned(scannedValue);
    if (isValueZpDon !== "zp_don") {
      toast.warning(ERROR_MESSAGES.SCANNED_ZP_IS_NOT_DON_ZP);
      return;
    }

    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGetZPInfo_Report113.tsx`
     */
    const zpPureValue = getPureZPValue(scannedValue);
    const zpInfo = await getZPInfo_Rep113(token!, zpPureValue, errorHandler);
    console.log({ zpInfo });
  };

  ////return
  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
  };
};
