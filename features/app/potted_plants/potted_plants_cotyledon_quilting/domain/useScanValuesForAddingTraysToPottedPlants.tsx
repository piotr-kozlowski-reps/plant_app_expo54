import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Tray, TrayShortInfo } from "@/features/shared/types/interfaces-tray";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useGetScannedTrayInfo } from "@/features/shared/data-access/useGetScannedTrayInfo";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { CotyledonQuilting } from "@/features/shared/types/interfaces-cotyledon_quilting";
import { useGetTrayInfoForDon_Report1711 } from "@/features/shared/data-access/useGetTrayInfoForDon_Report1711";

export const useScanValuesForAddingTraysToPottedPlants = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cotyledonQuiltingArray: CotyledonQuilting[],
  chosenColor: CotyledonQuilting | null,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getTrayInfoForDon_Report1711 } = useGetTrayInfoForDon_Report1711();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [currentTray, setCurrentTray] = useState<TrayShortInfo | null>(null);
  const [trays, setTrays] = useState<TrayShortInfo[]>([]);
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

    /**
     * @public
     * @guard
     * Jeżeli zeskanowana taca ma inny typ niż przekazany w cotyledonQuiltingArray[].tray_type -> info + koniec procedury.
     */
    const allowedTrayType = cotyledonQuiltingArray[0].tray_type;
    const isProperScannedTrayType = getIsProperScannedTrayType(
      scannedValue,
      allowedTrayType,
    );
    if (!isProperScannedTrayType) {
      toast.warning(getErrorMessageInfo(allowedTrayType, scannedValue));
      return;
    }

    /**
     * @public
     * @guard
     * Musi byc wybrany kolor, jeżeli nie to -> info + koniec procedury.
     */
    if (!chosenColor) {
      toast.warning(ERROR_MESSAGES.LACK_OF_CHOOSEN_COLOR);
      return;
    }

    /**
     * @public
     * @guard
     * Weryfikacja maksymalnej ilości tac, jakie mogą być wysiane dla tego koloru. Jeżeli ilość skanowanych tac, będzie większa niż dopuszczalna-> info + koniec procedury.
     */
    const isMaxNumberOfTraysExceeded = checkIfMaxNumberOfTraysExceeded(
      chosenColor,
      trays,
    );
    if (isMaxNumberOfTraysExceeded) {
      toast.warning(ERROR_MESSAGES.MAX_NUMBER_OF_TRAYS_EXCEEDED_FOR_THAT_COLOR);
      return;
    }

    /**
     * @public
     * @guard
     * Jeżeli zeskanowana taca, już znajduje się na liście -> info + koniec procedury.
     */
    const foundTrayOnTheList = trays.find(
      (tray) => tray.stk_id === getPureTrayValue(scannedValue),
    );
    if (foundTrayOnTheList) {
      toast.warning(ERROR_MESSAGES.TRAY_ALREADY_ON_THE_LIST);
      return;
    }

    setIsLoading(true);
    try {
      const scannedTrayInfo = await getTrayInfoForDon_Report1711(scannedValue);
      if (!scannedTrayInfo) return;

      /**
       * @public
       * @guard
       * Zeskanowana taca musi być umyta.
       * Jeżeli taca ma inny paramert event_type niz "WASH" -> info + koniec procedury.
       */
      if (scannedTrayInfo.event_type !== "WASH") {
        toast.warning(ERROR_MESSAGES.TRAY_IS_NOT_WASHED);
        return;
      }

      setTrays((prevTrays) => {
        const foundTray = prevTrays.find(
          (item) => item.stk_id === scannedTrayInfo.stk_id,
        );
        if (foundTray) return prevTrays;

        return [
          ...prevTrays,
          {
            stk_id: scannedTrayInfo.stk_id,
            scanned_raw_value: scannedValue,
          },
        ];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExistingTrayHandler = (tray: TrayShortInfo) => {
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
  function checkIfMaxNumberOfTraysExceeded(
    chosenColor: CotyledonQuilting,
    trays: TrayShortInfo[],
  ): boolean {
    const arrayAgg = chosenColor.array_agg;
    const numberOfAlreadyScannedTraysForThatColor = arrayAgg
      ? getTraysArrayOutOfArrayAsString(arrayAgg).length
      : 0;
    const numberOfAllTraysScannedWithCurrent =
      trays.length + numberOfAlreadyScannedTraysForThatColor + 1;
    const maxNumberOfAllowedTraysForThatColor = chosenColor.iletac;

    return (
      numberOfAllTraysScannedWithCurrent > maxNumberOfAllowedTraysForThatColor
    );
  }

  function getErrorMessageInfo(allowedTrayType: string, scannedValue: string) {
    return `Zeskanowałeś tacę: "${getPureTrayValue(scannedValue)}". Dozwolony typ tacy dla tego ZP'ka to: "${allowedTrayType}".`;
  }
  function getIsProperScannedTrayType(
    scannedValue: string,
    allowedTrayType: string,
  ): boolean {
    const trayId = getPureTrayValue(scannedValue);
    return trayId.startsWith(allowedTrayType);
  }
  function getIfZpAlreadyIncludesScannedTray(
    scannedValue: string,
    cotyledonQuiltingArray: CotyledonQuilting[],
  ): string | null {
    for (const colorKind of cotyledonQuiltingArray) {
      const traysArrayAsString = colorKind.array_agg;
      if (!traysArrayAsString || traysArrayAsString === "{NULL}") continue;

      const traysArray = getTraysArrayOutOfArrayAsString(traysArrayAsString);
      const trayId = getPureTrayValue(scannedValue);

      if (traysArray.includes(trayId)) {
        return `Zeskanowana taca (${trayId}) jest już podpięta do tego ZP, w kolorze: "${colorKind.twr_nazwa}".`;
      }
    }

    return null;
  }

  function getTraysArrayOutOfArrayAsString(
    traysArrayAsString: string,
  ): string[] {
    if (traysArrayAsString === "{NULL}") return [];

    const traysArray = traysArrayAsString
      .replace("{", "")
      .replace("}", "")
      .split(",");

    return traysArray;
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
