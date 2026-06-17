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
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";

export const useScanValuesForReplaceTray = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getTrayReplacementInfo_Report88 } =
    useGetTrayReplacementInfo_Report88();
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [oldTray, setOldTray] = useState<TrayReplaceInfo | null>(null);
  const [newTray, setNewTray] = useState<TrayReplaceInfo | null>(null);

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

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

    /**
     * @public
     * @procedureItem
     * @order 30
     * Skan starej tacy
     */
    try {
      setIsLoading(true);

      if (!oldTray) {
        const trayId = getPureTrayValue(scannedValue);
        setOldTray({ stk_id: trayId, scanned_raw_value: scannedValue });
      }

      if (oldTray) {
        const newTrayId = getPureTrayValue(scannedValue);

        /**
         * @public
         * @procedureItem
         * Skan nowej tacy
         */
        /**
         * @public
         * @procedureItem
         * raporty:
         * @readFile `features/shared/data-access/useGetTrayReplacementInfo_Report88.tsx`
         */
        const trayReplacementResponse = await getTrayReplacementInfo_Report88(
          oldTray.stk_id,
          newTrayId,
        );

        if (!trayReplacementResponse) {
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
          return;
        }

        /** guards */
        /**
         * @public
         * @guard
         * zabezpieczenie: porównanie czy obie tace nie mają takiego samego id -> info + koniec procedury)
         */

        if (newTrayId === oldTray.stk_id) {
          toast.warning(
            ERROR_MESSAGES.NEW_TRAY_MUST_BE_DIFFERENT_FROM_OLD_TRAY,
          );
          return;
        }

        /**
         * @public
         * @guard
         * zabezpieczenie: parametr: <b>ostkid</b> (jeżeli jest równe null - to znaczy, że taca nie jest wysiana -> info +  koniec procedury)
         */
        if (trayReplacementResponse.ostkid === null) {
          toast.warning(ERROR_MESSAGES.TRAY_IS_NOT_SOWN);
          resetAllValues();
          return;
        }

        /**
         * @public
         * @guard
         * zabezpieczenie: parametr: <b>nstkid</b>
         * (jeżeli jest równe 0 - to znaczy, że taca nie jest umyta lub jest przeznaczona do zniszczenia -> info +  koniec procedury)
         */
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
    newTray: TrayReplaceInfo | null,
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
    /**
     * @public
     * @transformApiItem
     * @order 200
     * wysyłka - custom api - POST:
     * adres: <b>{{URL}}</b>/api.php/REST/custom/<b>replacestickers</b>
     * @separator
     * <b>dane</b>:
     * [
     *     {
     *          stkold: string;
     *          stknew: string;
     *          scanned_raw_value: string;
     *     }
     * ]
     */
    //send data to server
    let response: TrayReplaceResponse = await query_postDataAsServerAction<
      TrayReplaceResponse,
      Post_TrayReplace_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/replacestickers",
      token!,
      [dataToBeSend],
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
