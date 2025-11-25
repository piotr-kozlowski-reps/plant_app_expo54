import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import {
  Post_TrayReplace_DTO,
  TrayReplaceInfo,
  TrayReplaceResponse,
} from "@/features/shared/types/interfaces-replace_tray";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

import { useGetTrayReplacementInfo_Report88 } from "@/features/shared/data-access/useGetTrayReplacementInfo_Report88";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";

export const useScanValuesForReplaceTray = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getTrayReplacementInfo_Report88 } =
    useGetTrayReplacementInfo_Report88();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [oldTray, setOldTray] = useState<TrayReplaceInfo | null>(null);
  const [newTray, setNewTray] = useState<TrayReplaceInfo | null>(null);

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

      if (!oldTray) {
        const trayId = getPureTrayValue(scannedValue);
        setOldTray({ stk_id: trayId, scanned_raw_value: scannedValue });
      }

      if (oldTray) {
        const newTrayId = getPureTrayValue(scannedValue);

        const trayReplacementResponse = await getTrayReplacementInfo_Report88(
          oldTray.stk_id,
          newTrayId
        );

        if (!trayReplacementResponse) {
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
          return;
        }

        /** guards */
        //check if that tray was not scanned already
        if (newTrayId === oldTray.stk_id) {
          toast.warning(
            ERROR_MESSAGES.NEW_TRAY_MUST_BE_DIFFERENT_FROM_OLD_TRAY
          );
          return;
        }

        //check if ostkid === null - wtedy stara taca nie jest wysiana
        if (trayReplacementResponse.ostkid === null) {
          toast.warning(ERROR_MESSAGES.TRAY_IS_NOT_SOWN);
          resetAllValues();
          return;
        }

        //check if nstkid === 0 - wtedy nowa taca zostala nie umyta lub jest przeznaczona do zniszczenia
        if (trayReplacementResponse.nstkid === 0) {
          toast.warning(ERROR_MESSAGES.TRAY_IS_NOT_CLEANED_OR_IS_DESTROYED);
          resetAllValues();
          return;
        }

        setNewTray({ stk_id: newTrayId, scanned_raw_value: scannedValue });
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  function resetAllValues() {
    setOldTray(null);
    setNewTray(null);
  }

  const sendValuesForReplaceTray = async (
    oldTray: TrayReplaceInfo | null,
    newTray: TrayReplaceInfo | null
  ) => {
    if (!oldTray || !newTray) {
      toast.warning(ERROR_MESSAGES.NO_INFO_ABOUT_TRAYS);
      return;
    }

    const dataToSent: Post_TrayReplace_DTO = {
      stkold: oldTray.stk_id,
      stknew: newTray.stk_id,
      scanned_raw_value: `stkold='${oldTray.scanned_raw_value}' stknew='${newTray.scanned_raw_value}'`,
    };

    try {
      setIsLoading(true);
      await sendToServer(dataToSent);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  //helpers
  async function sendToServer(dataToBeSend: Post_TrayReplace_DTO) {
    if (
      !dataToBeSend ||
      !dataToBeSend.stkold ||
      !dataToBeSend.stknew ||
      !dataToBeSend.scanned_raw_value
    ) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: TrayReplaceResponse = await query_postDataAsServerAction<
      TrayReplaceResponse,
      Post_TrayReplace_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/replacestickers",
      token!,
      [dataToBeSend]
    );

    //check if response array has the same amount of items as sent items
    const sentItemsQuantity = 1;
    const responseIDsQuantity = response.length;
    if (responseIDsQuantity === sentItemsQuantity) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
      resetAllValues();
    }
    if (responseIDsQuantity !== sentItemsQuantity) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }

  //hook return
  return {
    qrLock,
    oldTray,
    newTray,
    setQrLock,
    scanValueHandler,
    sendValuesForReplaceTray,
  };
};
