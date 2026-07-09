import { useState } from "react";
import * as Haptics from "expo-haptics";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import {
  TrayScannedValueForAddToZp,
  ZpScannedValueForAddToZp,
} from "@/features/shared/types/interface-add_to_zp";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { ZPDetailedInfo } from "@/features/shared/types/interfaces-zp";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useGetControlSowingChanges_Report119 } from "@/features/shared/data-access/useGetControlSowingChanges_Report119";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

export const useScanValuesForAddToZP = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { scanZpOrTrayRep113 } = useScanZpOrTrayRep113();
  const { errorHandler } = useErrorHandler();
  const { getControlSowingChanges_Report119 } =
    useGetControlSowingChanges_Report119();
  const { token } = useAuthSessionStore();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [zp, setZp] = useState<ZpScannedValueForAddToZp | null>(null);
  const [scannedTrays, setScannedTrays] = useState<
    TrayScannedValueForAddToZp[]
  >([]);
  const [chosenTray, setChosenTray] =
    useState<TrayScannedValueForAddToZp | null>(null);

  //modals
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal();

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);

    if (whatValueWasScanned === "unknown") {
      const warningMessage = `Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`;
      toast.warning(warningMessage, { id: warningMessage });
      return;
    }

    if (!zp) {
      const isZp = whatValueWasScanned === "zp_gru";
      if (!isZp) {
        toast.warning(ERROR_MESSAGES.ONLY_ZP_POSSIBLE, {
          id: ERROR_MESSAGES.ONLY_ZP_POSSIBLE,
        });
        return;
      }

      try {
        setIsLoading(true);
        /**
         * @public
         * @procedureItem
         * @order 20
         * Skan QR ZPka
         * @readFile `features/shared/data-access/useScanZpOrTrayRep113.tsx`
         */
        const foundZp = await scanZpOrTrayRep113(scannedValue, "zp_gru");
        if (!foundZp || !foundZp.ordnmb || !foundZp.twrkod) {
          toast.warning(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP, {
            id: ERROR_MESSAGES.LACK_OF_CHOSEN_ZP,
          });
          return;
        }

        //mapping
        const zpInfo: ZpScannedValueForAddToZp = {
          sordid: foundZp.ordid_,
          ordnmb: foundZp.ordnmb,
          twrkod: foundZp.twrkod,
          twrnzw: foundZp.twrnzw,
          scannedRawValue: scannedValue,
        };

        setZp(zpInfo);
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        setIsLoading(false);
      }
    }

    if (zp) {
      const isTray = whatValueWasScanned === "tray";
      if (!isTray) {
        toast.warning(ERROR_MESSAGES.ONLY_TRAY_POSSIBLE, {
          id: ERROR_MESSAGES.ONLY_TRAY_POSSIBLE,
        });
        return;
      }

      /** guards */
      /**
       * @public
       * @guard
       * @order 40
       * zabezpieczenie: weryfikacja czy taca nie została już zeskanowana wcześniej i nie jest na liście -> info
       */
      if (
        scannedTrays.some(
          (tray) => tray.stk_id === getPureTrayValue(scannedValue),
        )
      ) {
        toast.warning(ERROR_MESSAGES.TRAY_ALREADY_IN_LIST, {
          id: ERROR_MESSAGES.TRAY_ALREADY_IN_LIST,
        });
        return;
      }

      try {
        setIsLoading(true);
        /**
         * @public
         * @procedureItem
         * @order 30
         * Skan QR tacy:
         * @readFile `features/shared/data-access/useScanZpOrTrayRep113.tsx`
         */
        const foundTray = await scanZpOrTrayRep113(scannedValue, "tray");

        if (
          !foundTray ||
          !foundTray.stk_id ||
          !foundTray.ordnmb ||
          !foundTray.twrkod
        ) {
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA, {
            id: ERROR_MESSAGES.TRAY_LACKS_DATA,
          });
          return;
        }

        /** guards */
        /**
         * @public
         * @guard
         * @order 50
         * zabezpieczenie: <b>weryfikacja czy roślina na tacy może być dopięta do ZP</b>
         * (jeżeli pierwsze 3 człony <b>twrkod</b> nie są takie same - to znaczy, że taca nie może być dopięta do ZPka -> odrzucenie tacy)
         */
        if (!checkIfPlantOnTrayCanBeAddedToChosenZp(zp, foundTray)) {
          const warningMessage = `Taca z towarem o kodzie: "${foundTray.twrkod}" nie może być dodana do ZP z towarem o kodzie: "${zp.twrkod}".`;
          toast.warning(warningMessage, { id: warningMessage });
          return;
        }

        /**
         * @public
         * @guard
         * zabezpieczenie: weryfikacja taca nie jest już w tym ZP
         * (porównanie ordnmb ZPka i tacy - jeżeli takie same -> odrzucenie tacy)
         */
        if (foundTray.ordnmb === zp.ordnmb) {
          const warningMessage = `Zeskanowana taca należy już do wybranego ZP'ka.`;
          toast.warning(warningMessage, { id: warningMessage });
          return;
        }

        //fetch data from 119 report
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
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA, {
            id: ERROR_MESSAGES.TRAY_LACKS_DATA,
          });
          return;
        }

        //mapping
        const trayInfo: TrayScannedValueForAddToZp = {
          ordid_: foundTray.ordid_,
          ordnmb: foundTray.ordnmb,
          stk_id: foundTray.stk_id,
          stkid_: foundTray.stkid_,
          twrkod: foundTray.twrkod,
          twrnzw: foundTray.twrnzw,
          wsk_palet: foundTray.wsk_palet,
          outid_: foundTray.outid_,
          isgarden: foundTray.isgarden,
          scannedRawValue: scannedValue,
          stkid1: foundDataForReport119.stkid1,
          ordid1: foundDataForReport119.ordid1,
          ordnmb1: foundDataForReport119.ordnmb1,
          movid1: foundDataForReport119.movid1,
        };
        setScannedTrays((prev) => [...prev, trayInfo]);
      } catch (error) {
        errorHandler(error as Error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const showDeleteModal = (tray: TrayScannedValueForAddToZp) => {
    setChosenTray(tray);
    setIsShowDeleteModal(true);
  };

  const deleteTrayFromList = (stk_id: string) => {
    setScannedTrays((prev) => prev.filter((tray) => tray.stk_id !== stk_id));
  };

  const resetWholeState = () => {
    setChosenTray(null);
    setScannedTrays([]);
    setZp(null);
  };

  //hook return
  return {
    qrLock,
    zp,
    scannedTrays,
    isShowDeleteModal,
    chosenTray,

    setIsShowDeleteModal,
    setZp,
    scanValueHandler,
    setQrLock,
    showDeleteModal,
    deleteTrayFromList,
    resetWholeState,
  };
};

function checkIfPlantOnTrayCanBeAddedToChosenZp(
  zp: ZpScannedValueForAddToZp,
  tray: ZPDetailedInfo,
): boolean {
  const zpPlantCode = zp.twrkod;
  const trayPlantCode = tray.twrkod;

  const zpPlantCodeSplitted = zpPlantCode.split(".");
  const trayPlantCodeSplitted = trayPlantCode.split(".");

  for (let i = 0; i < 3; i++) {
    const zpElement = zpPlantCodeSplitted[i];
    const trayElement = trayPlantCodeSplitted[i];

    if (zpElement !== trayElement) {
      return false;
    }
  }

  return true;
}
