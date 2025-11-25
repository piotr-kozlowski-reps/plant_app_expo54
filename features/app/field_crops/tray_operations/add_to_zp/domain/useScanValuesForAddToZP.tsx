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
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
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
      toast.warning(`Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`);
      return;
    }

    if (!zp) {
      const isZp = whatValueWasScanned === "zp_gru";
      if (!isZp) {
        toast.warning(ERROR_MESSAGES.ONLY_ZP_POSSIBLE);
        return;
      }

      try {
        setIsLoading(true);
        const foundZp = await scanZpOrTrayRep113(scannedValue, "zp_gru");
        if (!foundZp || !foundZp.ordnmb || !foundZp.twrkod) {
          toast.warning(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP);
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
        toast.warning(ERROR_MESSAGES.ONLY_TRAY_POSSIBLE);
        return;
      }

      /** guards */
      //check if there is already the same tray
      if (
        scannedTrays.some(
          (tray) => tray.stk_id === getPureTrayValue(scannedValue)
        )
      ) {
        toast.warning(ERROR_MESSAGES.TRAY_ALREADY_IN_LIST);
        return;
      }

      try {
        setIsLoading(true);
        const foundTray = await scanZpOrTrayRep113(scannedValue, "tray");

        if (
          !foundTray ||
          !foundTray.stk_id ||
          !foundTray.ordnmb ||
          !foundTray.twrkod
        ) {
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
          return;
        }

        /** guards */
        //check if plant is the same or same enough to add to ZP
        if (!checkIfPlantOnTrayCanBeAddedToChosenZp(zp, foundTray)) {
          toast.warning(
            `Taca z towarem o kodzie: "${foundTray.twrkod}" nie może być dodana do ZP z towarem o kodzie: "${zp.twrkod}".`
          );
          return;
        }

        //compare zp from scanned zp and from tray - they cannot be the same
        if (foundTray.ordnmb === zp.ordnmb) {
          toast.warning(`Zeskanowana taca należy już do wybranego ZPka.`);
          return;
        }

        //fetch data from 119 report
        const foundDataForReport119 = await getControlSowingChanges_Report119(
          token!,
          foundTray.stk_id,
          "",
          foundTray.ordnmb,
          errorHandler
        );

        if (!foundDataForReport119) {
          toast.warning(ERROR_MESSAGES.TRAY_LACKS_DATA);
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
  tray: ZPDetailedInfo
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
