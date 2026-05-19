import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
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
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getScannedTrayInfo } = useGetScannedTrayInfo();
  // const { getTrayInfo_Rep113 } = useGetTrayInfo_Report113();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [currentTray, setCurrentTray] = useState<Tray | null>(null);
  const [trays, setTrays] = useState<Tray[]>([]);
  // const [
  //   isShowModalWithTrayComingUpCounter,
  //   setIsShowModalWithTrayComingUpCounter,
  // ] = useState(false);
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

  // const sendValuesForPlantsComingUpsCounter = async () => {
  //   if (!trays || !trays.length) {
  //     throw new Error(
  //       "useScanValuesForPlantsComingUpsCounter -> sendValuesForPlantsComingUpsCounter -> no trays",
  //     );
  //   }
  //   type TrayToBeSent = Pick<
  //     Tray,
  //     "sordid" | "ordnmb" | "stk_id" | "lckcnt" | "scanned_raw_value"
  //   > & { scanned_raw_value: string };
  //   const valuesToBeSent: TrayToBeSent[] = [];
  //   trays.forEach((tray) => {
  //     const trayToBeSent: TrayToBeSent = {
  //       sordid: tray.sordid,
  //       ordnmb: tray.ordnmb,
  //       stk_id: tray.stk_id,
  //       lckcnt: tray.lckcnt,
  //       scanned_raw_value: tray.scanned_raw_value,
  //     };
  //     valuesToBeSent.push(trayToBeSent);
  //   });
  //   const valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps =
  //     valuesToBeSent.filter((tray) => tray.lckcnt > 0);

  //   //send data to server
  //   /**
  //    * @public
  //    * @transformApiItem
  //    * wysyłka - custom api:
  //    * <b>{{URL}}</b>/api.php/REST/custom/<b>risecount</b>
  //    * dane - array obiektów:
  //    * {
  //    *  sordid: number
  //    *  ordnmb: string
  //    *  stk_id: string
  //    *  lckcnt: number
  //    *  scanned_raw_value: string
  //    * }
  //    *@separator
  //    */
  //   let response: RiseCountResponse;
  //   try {
  //     setIsLoading(true);
  //     response = await query_postDataAsServerAction<
  //       RiseCountResponse,
  //       TrayToBeSent[]
  //     >(
  //       configPerBuild.apiAddress,
  //       "/api.php/REST/custom/risecount",
  //       token!,
  //       valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps,
  //     );

  //     //check if response array has the same amount of items as sent items
  //     const responseIDsQuantity = response.length;
  //     const sentItemsQuantity =
  //       valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps.length;

  //     if (responseIDsQuantity === sentItemsQuantity) {
  //       toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
  //       resetWholeState();
  //     }
  //     if (responseIDsQuantity !== sentItemsQuantity) {
  //       toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
  //     }
  //   } catch (error) {
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
    // setIsShowModalWithTrayComingUpCounter,
    // sendValuesForPlantsComingUpsCounter,
    // addOrChangeQuantityInPlantsComingUpsCounterHandler,
    // addQuantityToExistingTrayHandler,
    setCurrentTray,
    setIsShowDeleteTrayModal,
    setIsShowQuantityAndSendModal,
    deleteExistingTrayHandler,
  };
};
