import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Tray } from "@/features/shared/types/interfaces-tray";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useGetScannedTrayInfo } from "@/features/shared/data-access/useGetScannedTrayInfo";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";

export const useScanValuesForAddingTraysToPottedPlants = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();
  const { getScannedTrayInfo } = useGetScannedTrayInfo();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [currentTray, setCurrentTray] = useState<Tray | null>(null);
  const [trays, setTrays] = useState<Tray[]>([]);
  const [isShowDeleteTrayModal, setIsShowDeleteTrayModal] = useState(false);
  const [isShowQuantityAndSendModal, setIsShowQuantityAndSendModal] =
    useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //allowed conditions
    /**
     * @public
     * @guard
     * Jeżeli taca była już wcześniej zeskanowana - info + koniec procedury.
     */
    if (checkWhatValueWasScanned(scannedValue) !== "tray") {
      toast.warning(
        `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. QRkod tacy ma inny format.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const scannedTrayInfo = await getScannedTrayInfo(scannedValue);
      if (!scannedTrayInfo) return;
      setTrays((prevTrays) => [...prevTrays, scannedTrayInfo]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExistingTrayHandler = (tray: Tray) => {
    const traysLocal = [...trays];

    const foundTray = traysLocal.find((item) => item.stk_id === tray.stk_id);

    if (!foundTray) {
      toast.error(ERROR_MESSAGES.NO_TRAY_ON_THE_LIST);
      return;
    }

    traysLocal.splice(traysLocal.indexOf(foundTray), 1);
    toast.success(MESSAGES.TRAY_REMOVED_WITH_SUCCESS);
    setTrays(traysLocal);
  };

  // function resetWholeState() {
  //   setCurrentTray(null);
  //   setTrays([]);
  //   setIsShowModalWithTrayComingUpCounter(false);
  //   setIsShowDeleteTrayModal(false);
  // }

  //hook return
  return {
    currentTray,
    qrLock,
    trays,
    isShowQuantityAndSendModal,
    isShowDeleteTrayModal,

    setQrLock,
    scanValueHandler,
    setCurrentTray,
    setIsShowDeleteTrayModal,
    setIsShowQuantityAndSendModal,
    deleteExistingTrayHandler,
  };
};
