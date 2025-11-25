import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";

import { TrayInfoWithPics } from "@/features/shared/types/interfaces-destroy_tray";
import { CameraView } from "expo-camera";
import { useHandleTakingPictures } from "@/features/shared/utils/useHandleTakingPictures";
import { useScanTrayToBeDestroyedRep84 } from "@/features/shared/data-access/useScanTrayToBeDestroyedRep84";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";

export const useScanValuesForDestroyTray = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  // const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { scanTrayToBeDestroyedRep84 } = useScanTrayToBeDestroyedRep84();
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<TrayInfoWithPics | null>(
    null
  );
  const {
    chosenPicture,
    isTakingPicturesAvailable,
    isShowDeleteModal,
    isShowFullPictureModal,
    setIsShowFullPictureModal,
    setIsShowDeleteModal,
    setChosenPicture,
    takePhotoHandler,
    deletePicture,
  } = useHandleTakingPictures<TrayInfoWithPics>(
    scannedValue,
    cameraRef,
    setScannedValue
  );

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["tray"]
    );
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isTray = whatValueWasScanned === "tray";
    if (!isTray) {
      toast.warning(ERROR_MESSAGES.ONLY_TRAY_POSSIBLE);
      return;
    }

    try {
      setIsLoading(true);

      const foundTray = await scanTrayToBeDestroyedRep84(scannedValue);

      if (!foundTray || !foundTray.stk_id || !foundTray.ordnmb) {
        toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
        return;
      }

      /** guards */
      if (foundTray.doc_id) {
        toast.warning(ERROR_MESSAGES.TRAY_ALREADY_DESTROYED);
        return;
      }

      // //mapping
      const trayInfo: TrayInfoWithPics = {
        ordnmb: foundTray.ordnmb,
        stk_id: foundTray.stk_id,
        scannedRawValue: scannedValue,
        pictures: [],
      };

      setScannedValue(trayInfo);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }

    // setScannedValue(zpInfo);
  };
  const resetValues = () => {
    setScannedValue(null);
  };

  //hook return
  return {
    qrLock,
    scannedValue,
    isTakingPicturesAvailable,
    chosenPicture,
    isShowDeleteModal,
    isShowFullPictureModal,
    setIsShowFullPictureModal,
    setIsShowDeleteModal,
    setChosenPicture,
    setQrLock,
    scanValueHandler,
    takePhotoHandler,
    deletePicture,
    resetValues,
  };
};
