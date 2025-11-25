import { useState } from "react";
import * as Haptics from "expo-haptics";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import {
  DeleteReason,
  TrayScannedValueForDisconnectFromZp,
} from "@/features/shared/types/interfaces-disconnect_from_zp";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useGetControlSowingChanges_Report119 } from "@/features/shared/data-access/useGetControlSowingChanges_Report119";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

export const useScanValuesForDisconnectFromZP = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { getControlSowingChanges_Report119 } =
    useGetControlSowingChanges_Report119();
  const { token } = useAuthSessionStore();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValues, setScannedValues] = useState<
    TrayScannedValueForDisconnectFromZp[]
  >([]);
  const [chosenTray, setChosenTray] =
    useState<TrayScannedValueForDisconnectFromZp | null>(null);

  //modals
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal();
  // const [isShowGiveReasonModal, setIsGiveReasonModal] = useShowModal();

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

      // //mapping
      const trayInfo: TrayScannedValueForDisconnectFromZp = {
        //zp
        ordid_: foundTray.ordid_,
        ordnmb: foundTray.ordnmb,

        //scanned row value
        scannedRawValue: scannedValue,

        //tray
        stk_id: foundTray.stk_id,
        stkid_: foundTray.stkid_,
        twrkod: foundTray.twrkod,
        twrnzw: foundTray.twrnzw,
        wsk_palet: foundTray.wsk_palet,
        isgarden: foundTray.isgarden,
        outid_: foundTray.outid_,
        stkid1: foundDataForReport119.stkid1,
        ordid1: foundDataForReport119.ordid1,
        ordnmb1: foundDataForReport119.ordnmb1,
        movid1: foundDataForReport119.movid1,

        // //delete reason
        // delete_reason_id: null,
        // delete_dscrpt: null,
      };
      setScannedValues((prev) => [...prev, trayInfo]);
      setChosenTray(trayInfo);
      // setIsGiveReasonModal(true);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDeleteModal = (tray: TrayScannedValueForDisconnectFromZp) => {
    setChosenTray(tray);
    setIsShowDeleteModal(true);
  };

  const deleteTrayFromList = (stk_id: string) => {
    setScannedValues((prev) => prev.filter((tray) => tray.stk_id !== stk_id));
  };

  const resetWholeState = () => {
    setChosenTray(null);
    setScannedValues([]);
  };

  const addOrChangeDeleteReason = (
    tray: TrayScannedValueForDisconnectFromZp,
    reason: DeleteReason
  ) => {
    const foundTray = scannedValues.find((item) => item.stk_id === tray.stk_id);
    if (!foundTray) {
      toast.error(ERROR_MESSAGES.NO_TRAY_ON_THE_LIST);
      return;
    }

    // foundTray.delete_dscrpt = reason.delete_dscrpt;
    // foundTray.delete_reason_id = reason.delete_reason_id;
  };

  //hook return
  return {
    qrLock,
    scannedValues,
    isShowDeleteModal,
    chosenTray,
    // isShowGiveReasonModal,

    setChosenTray,
    // setIsGiveReasonModal,
    setIsShowDeleteModal,
    scanValueHandler,
    setQrLock,
    showDeleteModal,
    deleteTrayFromList,
    resetWholeState,
    addOrChangeDeleteReason,
  };
};
