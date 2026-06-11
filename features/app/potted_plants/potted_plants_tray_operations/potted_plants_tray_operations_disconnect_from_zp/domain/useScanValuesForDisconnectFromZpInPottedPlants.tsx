import { CameraView } from "expo-camera";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { ZPDetailedInfo } from "@/features/shared/types/interfaces-zp";

export const useScanValuesForDisconnectFromZpInPottedPlants = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZPDetailedInfo | null>(null);

  //fn
  /**
   * @public
   * @procedureItem
   * @order 20
   * skan QR tacy
   */

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * @order 20
     * zeskanowac można tylko tacę
     */
    //check allowed scanned values
    const isScannedDataCorrect = checkIsScannedDataCorrect(scannedValue, [
      "tray",
    ]);
    if (!isScannedDataCorrect) return;
    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isTray = whatValueWasScanned === "tray";
    if (!isTray) {
      toast.warning(ERROR_MESSAGES.ONLY_TRAY_POSSIBLE);
      return;
    }

    try {
      setIsLoading(true);

      /**
       * @public
       * @procedureItem
       * raporty:
       * @readFile `features/shared/data-access/useScanZpOrTrayRep113.tsx`
       */
      const foundTray = await scanZpOrTrayRep113(scannedValue, "tray");

      if (!foundTray || !foundTray.stk_id || !foundTray.ordnmb) {
        toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
        return;
      }

      setScannedValue(foundTray);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  //hook return
  return {
    qrLock,
    scannedValue,
    // isTakingPicturesAvailable,
    // chosenPicture,
    // isShowDeleteModal,
    // isShowFullPictureModal,
    // setIsShowFullPictureModal,
    // setIsShowDeleteModal,
    // setChosenPicture,
    setQrLock,
    scanValueHandler,
    // takePhotoHandler,
    // deletePicture,
    // resetValues,
  };
};
