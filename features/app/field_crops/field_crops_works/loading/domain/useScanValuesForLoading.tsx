import { useState } from "react";
import * as Haptics from "expo-haptics";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { ZpScannedValueForLoading } from "@/features/shared/types/interfaces-loading";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useAllowScanOnlyZpOrTray } from "@/features/shared/utils/useAllowScanOnlyZpOrTray";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { useCheckIfZpIsAlreadyScanned } from "@/features/shared/utils/useCheckIfZPIsAlreadyScanned";
import { useShowModal } from "@/features/shared/utils/useShowModal";

export const useScanValuesForLoading = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { checkIfZpIsAlreadyScanned } = useCheckIfZpIsAlreadyScanned();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValues, setScannedValues] = useState<
    ZpScannedValueForLoading[]
  >([]);
  const [chosenZp, setChosenZp] = useState<ZpScannedValueForLoading | null>(
    null
  );

  //modals
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal();

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const { isNoZpOrTray, whatValueWasScanned } =
      useAllowScanOnlyZpOrTray(scannedValue);
    if (isNoZpOrTray) return;

    //check if ZP is already scanned
    const zpOrdnmb = getPureZPValue(scannedValue);
    if (checkIfZpIsAlreadyScanned(zpOrdnmb, scannedValues)) {
      toast.warning(ERROR_MESSAGES.VALUE_ALREADY_SCANNED);
      return;
    }

    try {
      setIsLoading(true);

      const foundZP = await scanZpOrTrayRep113(
        scannedValue,
        whatValueWasScanned
      );
      if (!foundZP) return;

      /** guards */
      // alert("czy zeskanowana juz taca jest taka");

      //mapping
      const ZPInfo: ZpScannedValueForLoading = {
        ordnmb: foundZP.ordnmb,
        sordid: foundZP.ordid_,
        twrnzw: foundZP.twrnzw,
        stkcnt: foundZP.stkcnt,
        outcnt: foundZP.outcnt,
        scannedRawValue: scannedValue,
      };

      setScannedValues((prev) => [...prev, ZPInfo]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteZpFromList = (ordnmb: string) => {
    setScannedValues((prev) => prev.filter((zp) => zp.ordnmb !== ordnmb));
  };
  const showDeleteModal = (zp: ZpScannedValueForLoading) => {
    setChosenZp(zp);
    setIsShowDeleteModal(true);
  };

  const resetWholeState = () => {
    setScannedValues([]);
    setChosenZp(null);
  };

  //hook return
  return {
    qrLock,
    scannedValues,
    isShowDeleteModal,
    chosenZp,
    setIsShowDeleteModal,
    setQrLock,
    scanValueHandler,
    deleteZpFromList,
    showDeleteModal,
    resetWholeState,
  };

  /** helpers */
};
