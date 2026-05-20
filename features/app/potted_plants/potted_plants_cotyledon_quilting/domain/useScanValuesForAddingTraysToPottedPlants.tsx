import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Tray } from "@/features/shared/types/interfaces-tray";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useGetScannedTrayInfo } from "@/features/shared/data-access/useGetScannedTrayInfo";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { CotyledonQuilting } from "@/features/shared/types/interfaces-cotyledon_quilting";

export const useScanValuesForAddingTraysToPottedPlants = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cotyledonQuiltingArray: CotyledonQuilting[],
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getScannedTrayInfo } = useGetScannedTrayInfo();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [currentTray, setCurrentTray] = useState<Tray | null>(null);
  const [trays, setTrays] = useState<Tray[]>([]);
  const [isShowDeleteTrayModal, setIsShowDeleteTrayModal] = useState(false);
  const [isShowQuantityAndSendModal, setIsShowQuantityAndSendModal] =
    useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    // console.log("scanValueHandler");
    // console.log({ scannedValue });
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

    //allowed conditions
    /**
     * @public
     * @guard
     * Jeżeli taca jest już podpięta do ZP - info, w którym kolorze jest podpięta + koniec procedury.
     */
    const zpAlreadyIncludesScannedTrayMessageInfo =
      getIfZpAlreadyIncludesScannedTray(scannedValue, cotyledonQuiltingArray);
    if (zpAlreadyIncludesScannedTrayMessageInfo) {
      toast.warning(zpAlreadyIncludesScannedTrayMessageInfo);
      return;
    }

    setIsLoading(true);
    try {
      const scannedTrayInfo = await getScannedTrayInfo(scannedValue);
      if (!scannedTrayInfo) return;
      setTrays((prevTrays) => {
        const foundTray = prevTrays.find(
          (item) => item.stk_id === scannedTrayInfo.stk_id,
        );
        if (foundTray) return prevTrays;

        return [...prevTrays, scannedTrayInfo];
      });
    } catch (error) {
      console.error(error);
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

  //helpers
  function getIfZpAlreadyIncludesScannedTray(
    scannedValue: string,
    cotyledonQuiltingArray: CotyledonQuilting[],
  ): string | null {
    for (const colorKind of cotyledonQuiltingArray) {
      const traysArrayAsString = colorKind.array_agg;
      if (traysArrayAsString === "{NULL}") continue;

      const traysArray = traysArrayAsString
        .replace("{", "")
        .replace("}", "")
        .split(",");
      const trayId = getPureTrayValue(scannedValue);

      if (traysArray.includes(trayId)) {
        return `Zeskanowana taca (${trayId}) jest już podpięta do tego ZP, w kolorze: "${colorKind.twr_nazwa}".`;
      }
    }

    return null;
  }

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
    setCurrentTray,
    setIsShowDeleteTrayModal,
    setIsShowQuantityAndSendModal,
    deleteExistingTrayHandler,
  };
};
