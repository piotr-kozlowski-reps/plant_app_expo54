import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import {
  RiseCountResponse,
  Tray,
  TrayResponse,
} from "@/features/shared/types/interfaces-tray";
import { toast } from "sonner-native";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { configPerBuild } from "@/features/shared/env/env";
import { getRepId113 } from "@/features/shared/data-access/getRepId113";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useGetTrayInfo_Report113 } from "@/features/shared/data-access/useGetTrayInfo_Report113";

export const useScanValuesForPlantsComingUpsCounter = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getTrayInfo_Rep113 } = useGetTrayInfo_Report113();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [currentTray, setCurrentTray] = useState<Tray | null>(null);
  const [trays, setTrays] = useState<Tray[]>([]);
  const [
    isShowModalWithTrayComingUpCounter,
    setIsShowModalWithTrayComingUpCounter,
  ] = useState(false);
  const [isShowDeleteTrayModal, setIsShowDeleteTrayModal] = useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    if (checkWhatValueWasScanned(scannedValue) !== "tray") {
      toast.warning(
        `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. QRkod tacy ma inny format.`
      );
      return;
    }

    setIsLoading(true);
    try {
      await scanTray(scannedValue);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const sendValuesForPlantsComingUpsCounter = async () => {
    if (!trays || !trays.length) {
      throw new Error(
        "useScanValuesForPlantsComingUpsCounter -> sendValuesForPlantsComingUpsCounter -> no trays"
      );
    }
    type TrayToBeSent = Pick<
      Tray,
      "sordid" | "ordnmb" | "stk_id" | "lckcnt" | "scanned_raw_value"
    > & { scanned_raw_value: string };
    const valuesToBeSent: TrayToBeSent[] = [];
    trays.forEach((tray) => {
      const trayToBeSent: TrayToBeSent = {
        sordid: tray.sordid,
        ordnmb: tray.ordnmb,
        stk_id: tray.stk_id,
        lckcnt: tray.lckcnt,
        scanned_raw_value: tray.scanned_raw_value,
      };
      valuesToBeSent.push(trayToBeSent);
    });
    const valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps =
      valuesToBeSent.filter((tray) => tray.lckcnt > 0);

    //send data to server
    let response: RiseCountResponse;
    try {
      setIsLoading(true);
      response = await query_postDataAsServerAction<
        RiseCountResponse,
        TrayToBeSent[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/risecount",
        token!,
        valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps
      );

      //check if response array has the same amount of items as sent items
      const responseIDsQuantity = response.length;
      const sentItemsQuantity =
        valuesToBeSentFilteredByNonZeroAmountOfLacksOdComingUps.length;

      if (responseIDsQuantity === sentItemsQuantity) {
        toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
        resetWholeState();
      }
      if (responseIDsQuantity !== sentItemsQuantity) {
        toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
      }
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

  const addOrChangeQuantityInPlantsComingUpsCounterHandler = (
    passedTray: Tray
  ) => {
    if (!passedTray) {
      errorHandler(
        new Error(
          "useScanValuesForPlantsComingUpsCounter -> addOrChangeQuantityInPlantsComingUpsCounterHandler -> no tray"
        )
      );
      return;
    }

    if (!trays.length) setTrays([passedTray]);
    if (trays.length) {
      const traysLocal = [...trays];

      //check if Tray that is to be added already exists in the list
      const foundTray = traysLocal.find(
        (item) => item.stk_id === passedTray.stk_id
      );

      if (!foundTray) {
        traysLocal.push(passedTray);
        setTrays(traysLocal);
      }
      50;
      if (foundTray) {
        setTrays(addExistingTraysQuantity(traysLocal, passedTray, 0));
      }
    }

    toast.success(
      `Dodano do listy/Zmieniono ${passedTray.stk_id} (wraz z informacją o brakach).`
    );
  };

  const addQuantityToExistingTrayHandler = (tray: Tray, quantity: number) => {
    if (!tray) {
      errorHandler(
        new Error(
          "useScanValuesForPlantsComingUpsCounter -> addQuantityToExistingTrayHandler -> no tray"
        )
      );
      return;
    }

    setTrays(addExistingTraysQuantity([...trays], tray, quantity));
  };

  //helpers
  const addExistingTraysQuantity = (
    trays: Tray[],
    chosenTray: Tray,
    quantityToBeAdded: number
  ): Tray[] => {
    const traysResult = [...trays];

    for (let item of traysResult) {
      if (item.stk_id === chosenTray.stk_id) {
        const resultValue = chosenTray.lckcnt + quantityToBeAdded;

        if (resultValue < 0) {
          toast.warning(
            ERROR_MESSAGES.NUMBER_OF_TRAY_BAD_PLANTS_CANNOT_BE_LESS_THAN_0
          );
        } else {
          item.lckcnt = resultValue;
        }
      }
    }

    return traysResult;

    // setTrays(traysLocal);
  };
  async function scanTray(scannedValue: string) {
    const scannedStk_id = getPureTrayValue(scannedValue);

    //check if tray is already scanned
    if (checkIfTrayIsAlreadyScanned(scannedStk_id, trays)) {
      toast.warning(ERROR_MESSAGES.VALUE_ALREADY_SCANNED);
      return;
    }

    //fetch data
    const trayInfo = await getTrayInfo_Rep113(
      token!,
      scannedValue,
      errorHandler
    );

    if (!trayInfo) return;

    //to process tray further property "stkcnt" must be null or -1
    const isPossibleToPressTray =
      trayInfo.lckcnt === null || trayInfo.lckcnt === -1;
    if (!isPossibleToPressTray) {
      toast.error(
        `Dla tej tacy (${scannedStk_id}) wprowadzono już ilość braków (${trayInfo.lckcnt}).`
      );
      return;
    }

    setCurrentTray(trayInfo);
    setIsShowModalWithTrayComingUpCounter(true);
  }

  function resetWholeState() {
    setCurrentTray(null);
    setTrays([]);
    setIsShowModalWithTrayComingUpCounter(false);
    setIsShowDeleteTrayModal(false);
  }

  //hook return
  return {
    currentTray,
    trays,
    qrLock,
    isShowModalWithTrayComingUpCounter,
    isShowDeleteTrayModal,
    scanValueHandler,
    setQrLock,
    setIsShowModalWithTrayComingUpCounter,
    sendValuesForPlantsComingUpsCounter,
    addOrChangeQuantityInPlantsComingUpsCounterHandler,
    addQuantityToExistingTrayHandler,
    setCurrentTray,
    setIsShowDeleteTrayModal,
    deleteExistingTrayHandler,
  };
};

//utils
const checkIfTrayIsAlreadyScanned = (
  trayID: string,
  trays: Tray[]
): boolean => {
  if (!trays.length) return false;
  return trays.some((tray) => tray.stk_id === trayID);
};
