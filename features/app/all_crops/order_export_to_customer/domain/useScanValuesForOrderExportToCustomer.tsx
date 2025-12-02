import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { CameraView } from "expo-camera";

import { useHandleTakingPictures } from "@/features/shared/utils/useHandleTakingPictures";
import { AllExportToCustomerSubmodules } from "@/features/shared/types/interfaces-auth";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";

export const useScanValuesForOrderExportToCustomer = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cameraRef: React.MutableRefObject<CameraView | null>,
  submoduleType: AllExportToCustomerSubmodules
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { renderDateInPolishWay } = useDatesHelper();
  const { checkWhatValueWasScanned, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] =
    useState<ZPShortenedInfoWithPics | null>(null);
  const [isSuperData, setIsSuperData] = useState(false);
  const [inHowManyDays, setInHowManyDays] = useState<number>(0);
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
  } = useHandleTakingPictures<ZPShortenedInfoWithPics>(
    scannedValue,
    cameraRef,
    setScannedValue
  );

  //modals
  const [isShowModalWithInHowManyDays, setIsShowModalWithInHowManyDays] =
    useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const arrayOfAllowedScannedValues: TypeOfScannedValue[] =
      submoduleType === "greenhouse_crops_works_order_export_to_customer"
        ? ["zp_roz"]
        : ["tray", "zp_gru"];

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      arrayOfAllowedScannedValues
    );
    if (!isScannedDataCorrect) {
      return;
    }

    ///////
    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);

    // const { isZP, isTray, isNoZpOrTray, whatValueWasScanned, } =
    //   useAllowScanOnlyZpOrTray(scannedValue);
    // if (isNoZpOrTray) return;

    try {
      setIsLoading(true);

      //allowed conditions
      if (isScannedDataCorrect) {
        const scannedOrdnmb = getPureZPValue(scannedValue);

        const foundZP = await getZPInfo_Rep113(
          token!,
          scannedOrdnmb,
          errorHandler
        );
        if (!foundZP) return;

        /** guards */
        //if "outmvplan" - order export to client is already set - info and return
        if (foundZP.outmvplan) {
          toast.warning(
            `${
              ERROR_MESSAGES.DATE_OF_ORDER_EXPORT_TO_CUSTOMER_ALREADY_SET
            } ${renderDateInPolishWay(foundZP.outmvplan)}.`
          );
          return;
        }

        //if "dtlstm" is null - no any movement was done before - impossible to send to client -  info and return
        if (!foundZP.dtlstm) {
          toast.warning(ERROR_MESSAGES.NO_EARLIER_INTERNAL_MOVEMENTS);
          return;
        }

        //mapping
        const ZPInfo: ZPShortenedInfoWithPics = {
          ordnmb: foundZP.ordnmb,
          sordid: foundZP.ordid_,
          tmsdat: foundZP.tmsdat,
          twrnzw: foundZP.twrnzw,
          prc_id: foundZP.prc_id,
          pictures: [],
          scannedRawValue: scannedValue,
        };

        const resultOfChangingDate = changeDateInHowManyDaysAccordingToTMS(
          ZPInfo.tmsdat
        );
        if (!resultOfChangingDate) {
          toast.warning(ERROR_MESSAGES.NO_TMS_DATE_IN_ZP);
          return;
        }

        setScannedValue(ZPInfo);
        return;
      }

      throw new Error(
        "useScanValuesForOrderToHardener -> scanValueHandler - condition not implemented."
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const changeInHowManyDaysHandler = (inHowManyDaysInput: number) => {
    /** guard: cannot order to todays and tomorrows date when is after 13:00 - for field crops*/
    if (submoduleType === "greenhouse_crops_works_order_export_to_customer") {
      const isPossibleToProcess_Before13 =
        getIsPossibleToProcess_After13_guard();
      if (inHowManyDaysInput < 3 && !isPossibleToProcess_Before13) {
        toast.warning(
          ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW
        );
        return;
      }
    }

    setInHowManyDays(inHowManyDaysInput);
  };

  // const changeInHowManyDaysHandler = (inHowManyDaysInput: number) => {
  //   /** guard: cannot order to  tomorrow and day after tomorrow date when is after 13:00 - for greenhouse crops */
  //   if (whatOrderType === "greenhouse_crops_works_order_to_spacing") {
  //     const isPossibleToProcess_Before13 =
  //       getIsPossibleToProcess_After13_guard();
  //     if (inHowManyDaysInput < 3 && !isPossibleToProcess_Before13) {
  //       toast.warning(
  //         ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW
  //       );
  //       return;
  //     }
  //   }

  //   /** guard: cannot order to todays and tomorrows date when is after 13:00 - for field crops*/
  //   const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
  //   if (inHowManyDaysInput < 2 && !isPossibleToProcess_Before13) {
  //     toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
  //     return;
  //   }

  //   setInHowManyDays(inHowManyDaysInput);
  // };

  const resetValues = () => {
    setScannedValue(null);
    setInHowManyDays(0);
    setIsSuperData(false);
    setChosenPicture(null);
  };

  //hook return
  return {
    qrLock,
    isSuperData,
    isShowModalWithInHowManyDays,
    inHowManyDays,
    scannedValue,
    isShowDeleteModal,
    chosenPicture,
    isShowFullPictureModal,
    isTakingPicturesAvailable,
    setIsShowFullPictureModal,
    setChosenPicture,
    setIsShowDeleteModal,
    setIsShowModalWithInHowManyDays,
    setIsSuperData,
    setQrLock,
    scanValueHandler,
    changeInHowManyDaysHandler,
    takePhotoHandler,
    deletePicture,
    resetValues,
  };

  /** helpers */
  function changeDateInHowManyDaysAccordingToTMS(date: Date | null): boolean {
    if (!date) {
      return false;
    }

    const today = new Date();
    const timeDiff = date.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setInHowManyDays(daysDiff);
    return true;
  }
};
