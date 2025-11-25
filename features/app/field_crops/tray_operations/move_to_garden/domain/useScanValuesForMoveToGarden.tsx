import { useState } from "react";
import * as Haptics from "expo-haptics";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { TrayScannedValueForMovingToGarden } from "@/features/shared/types/interfaces-move_to_garden";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useGetControlSowingChanges_Report119 } from "@/features/shared/data-access/useGetControlSowingChanges_Report119";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

export const useScanValuesForMoveToGarden = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { getControlSowingChanges_Report119 } =
    useGetControlSowingChanges_Report119();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [isDefective, setIsDefective] = useState(false);
  const [scannedValues, setScannedValues] = useState<
    TrayScannedValueForMovingToGarden[]
  >([]);
  const [chosenTray, setChosenTray] =
    useState<TrayScannedValueForMovingToGarden | null>(null);

  //modals
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal();

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    if (whatValueWasScanned === "unknown") {
      toast.warning(`Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`);
      return;
    }
    const isTray = whatValueWasScanned === "tray";
    if (!isTray) {
      toast.warning(ERROR_MESSAGES.ONLY_TRAY_POSSIBLE);
      return;
    }

    /** guards */
    //check if there is already the same tray
    if (
      scannedValues.some(
        (tray) => tray.stk_id === getPureTrayValue(scannedValue)
      )
    ) {
      toast.warning(ERROR_MESSAGES.TRAY_ALREADY_IN_LIST);
      return;
    }

    try {
      setIsLoading(true);
      const foundTray = await scanZpOrTrayRep113(scannedValue, "tray");

      if (!foundTray || !foundTray.stk_id || !foundTray.ordnmb) {
        toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
        return;
      }

      /** guards */
      //check property "isgarden" if not null - then tray is in garden
      if (foundTray.isgarden !== null) {
        toast.warning(ERROR_MESSAGES.TRAY_ALREADY_IN_GARDEN);
        return;
      }

      //fetch data from 119 report
      const foundDataForReport119 = await getControlSowingChanges_Report119(
        token!,
        foundTray.stk_id,
        "",
        foundTray.ordnmb,
        errorHandler
      );

      if (!foundDataForReport119) {
        toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
        return;
      }

      //mapping
      const trayInfo: TrayScannedValueForMovingToGarden = {
        ordid_: foundTray.ordid_,
        ordnmb: foundTray.ordnmb,
        stk_id: foundTray.stk_id,
        stkid_: foundTray.stkid_,
        twrkod: foundTray.twrkod,
        twrnzw: foundTray.twrnzw,
        wsk_palet: foundTray.wsk_palet,
        outid_: foundTray.outid_,
        isgarden: foundTray.isgarden,
        scannedRawValue: scannedValue,
        stkid1: foundDataForReport119.stkid1,
        ordid1: foundDataForReport119.ordid1,
        ordnmb1: foundDataForReport119.ordnmb1,
        movid1: foundDataForReport119.movid1,
      };
      setScannedValues((prev) => [...prev, trayInfo]);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDeleteModal = (tray: TrayScannedValueForMovingToGarden) => {
    setChosenTray(tray);
    setIsShowDeleteModal(true);
  };

  const deleteTrayFromList = (stk_id: string) => {
    setScannedValues((prev) => prev.filter((tray) => tray.stk_id !== stk_id));
  };

  const resetWholeState = () => {
    setIsDefective(false);
    setChosenTray(null);
    setScannedValues([]);
  };

  //hook return
  return {
    qrLock,
    scannedValues,
    isShowDeleteModal,
    chosenTray,
    isDefective,

    setIsDefective,
    setIsShowDeleteModal,
    scanValueHandler,
    setQrLock,
    showDeleteModal,
    deleteTrayFromList,
    resetWholeState,
  };
};
