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
import { TrayScannedValueForDisconnectFromZp } from "@/features/shared/types/interfaces-disconnect_from_zp";
import { useGetControlSowingChanges_Report119 } from "@/features/shared/data-access/useGetControlSowingChanges_Report119";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

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
  const { getControlSowingChanges_Report119 } =
    useGetControlSowingChanges_Report119();
  const { token } = useAuthSessionStore();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] =
    useState<TrayScannedValueForDisconnectFromZp | null>(null);

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

      /**
       * @public
       * @guard
       * zeskanowac można tylko tacę należącą do ZP z końcówką DON, jeżeli inna -> info i koniec procedury.
       */
      if (!foundTray.ordnmb.endsWith("DON")) {
        toast.warning(ERROR_MESSAGES.TRAY_DOES_NOT_BELONG_TO_DON_ZP);
        return;
      }
      /**
       * @public
       * @procedureItem
       * raporty:
       * @readFile `features/shared/data-access/useGetControlSowingChanges_Report119.tsx`
       */
      const foundDataForReport119 = await getControlSowingChanges_Report119(
        token!,
        foundTray.stk_id,
        "",
        foundTray.ordnmb,
        errorHandler,
      );
      if (!foundDataForReport119) {
        toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
        return;
      }

      //mapping
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
      };

      setScannedValue({ ...trayInfo, scannedRawValue: scannedValue });
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetValues = () => {
    setScannedValue(null);
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
    resetValues,
  };
};
