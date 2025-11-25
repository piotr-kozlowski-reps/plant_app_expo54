import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Localization } from "@/features/shared/types/interfaces-localization";
import { useScannedValuesForZP } from "./useScannedValuesForZP";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import { useGetTrayInfo_Report113 } from "@/features/shared/data-access/useGetTrayInfo_Report113";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";

import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";

import { useScanHelpers } from "@/features/shared/utils/useScanHelpers";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";

export const useScanValuesForOrderToHardener = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  whatOrderType: AllCropsOrdersSubmodules
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureFieldValue, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { getTrayInfo_Rep113 } = useGetTrayInfo_Report113();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { checkIfValueIsAlreadyScanned, scanField } = useScanHelpers();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [inHowManyDays, setInHowManyDays] = useState<number | null>(3);
  const [targetLocalization, setTargetLocalization] =
    useState<Localization | null>(null);
  const [isFieldScanned, setIsFieldScanned] = useState(false);
  const [isZPScanned, setIsZPScanned] = useState(false);
  //scannedValues
  const { scannedValues, setScannedValues } = useScannedValuesForZP(
    isFieldScanned,
    setIsFieldScanned,
    isZPScanned,
    setIsZPScanned
  );
  const [ZPSelected, setZPSelected] =
    useState<ZPShortenedInfoWithoutTwrnzw | null>(null);
  const [isRememberMe, setIsRememberMe] = useState(false);
  //modals
  const [isShowModalTargetLocalization, setIsShowModalTargetLocalization] =
    useState(true);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowModalWithInHowManyDays, setIsShowModalWithInHowManyDays] =
    useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["tray", "field", "zp_gru"]
    );
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isZP = whatValueWasScanned === "zp_gru";
    const isField = whatValueWasScanned === "field";
    const isTray = whatValueWasScanned === "tray";

    try {
      setIsLoading(true);

      //allowed conditions
      if (isZP) {
        await scanZpOrTrayForOrderToHardenerHandler(scannedValue, "zp_gru");
        return;
      }

      if (isTray) {
        await scanZpOrTrayForOrderToHardenerHandler(scannedValue, "tray");
        return;
      }

      if (isField) {
        const warningMessage =
          whatOrderType === "field_crops_works_order_to_hardener"
            ? ERROR_MESSAGES.NO_ZPS_WHERE_DATE_OF_ORDER_TO_HARDENER_WAS_NOT_SET
            : ERROR_MESSAGES.NO_ZPS_WHERE_DATE_OF_ORDER_TO_INTERNAL_TRANSPORT_WAS_NOT_SET;
        await scanField({
          scannedValue,
          isZPScanned,
          warning_message: warningMessage,
          setIsFieldScanned,
          setScannedValues,
          isToFilterByMvplok: true,
          callbacksFilters: [],
          callbacksGuards: [],
        });
        return;
      }

      throw new Error(
        "useScanValuesForOrderToHardener -> scanValueHandler - condition not implemented."
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTargetLocalizationHandler = (localization: Localization) => {
    setTargetLocalization(localization);
  };

  const deleteValueFromList = (
    zpInfo: ZPShortenedInfoWithoutTwrnzw | null
  ): void => {
    if (zpInfo === null) {
      toast.warning(ERROR_MESSAGES.ZP_CANNOT_BE_DELETED_NO_INFO);
      return;
    }

    toast.success(MESSAGES.ZP_DELETED_SUCCESS);
    const updatedValues = scannedValues.filter(
      (zp) => zp.ordnmb !== zpInfo.ordnmb
    );
    setScannedValues(updatedValues);
  };

  const clearScannedValues = () => {
    setScannedValues([]);
  };

  const changeInHowManyDaysHandler = (inHowManyDaysInput: number) => {
    /** guard: cannot order to  tomorrow and day after tomorrow date when is after 13:00 - for greenhouse crops */
    if (whatOrderType === "greenhouse_crops_works_order_to_spacing") {
      const isPossibleToProcess_Before13 =
        getIsPossibleToProcess_After13_guard();
      if (inHowManyDaysInput < 3 && !isPossibleToProcess_Before13) {
        toast.warning(
          ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW
        );
        return;
      }
    }

    /** guard: cannot order to todays and tomorrows date when is after 13:00 - for field crops*/
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDaysInput < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    setInHowManyDays(inHowManyDaysInput);
  };

  return {
    scannedValues,
    targetLocalization,
    qrLock,
    inHowManyDays,
    isShowModalTargetLocalization,
    isFieldScanned,
    isShowDeleteModal,
    ZPSelected,
    isShowModalWithInHowManyDays,
    isRememberMe,
    setIsRememberMe,
    setIsShowModalWithInHowManyDays,
    setZPSelected,
    setIsShowDeleteModal,
    setIsShowModalTargetLocalization,
    setQrLock,
    scanValueHandler,
    setTargetLocalizationHandler,
    deleteValueFromList,
    clearScannedValues,
    changeInHowManyDaysHandler,
  };

  /** helpers */
  async function scanZpOrTrayForOrderToHardenerHandler(
    scannedValue: string,
    whatValueWasScanned: TypeOfScannedValue
  ) {
    if (whatValueWasScanned !== "tray" && whatValueWasScanned !== "zp_gru") {
      toast.warning(
        ERROR_MESSAGES.WRONG_PARAMETER +
          "-> " +
          whatValueWasScanned +
          " -> scanZpOrTrayForOrderToHardenerHandler"
      );
      return;
    }

    if (whatValueWasScanned === "zp_gru") {
      //check if ZP is already on list
      const scannedOrdnmb = getPureZPValue(scannedValue);
      if (
        checkIfValueIsAlreadyScanned<ZPShortenedInfoWithoutTwrnzw>(
          scannedOrdnmb,
          scannedValues
        )
      ) {
        toast.warning(ERROR_MESSAGES.ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST);
        return;
      }
      if (!isZPScanned) setIsZPScanned(true);

      //fetch ZP
      const foundZP = await getZPInfo_Rep113(
        token!,
        scannedOrdnmb,
        errorHandler
      );
      if (!foundZP) {
        toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
        return;
      }

      /** guard - allowmvplan has to be true -> turned off */
      // const textForOrderToHardener = `Data wywozu tego zlecenia na hartownik została już ustalona na dzień ${renderDateInPolishWay(
      //   foundZP.tmpmvplan
      // )}`;

      // const textForOrderInternalTransport = `Zlecono już transport dla tego zlecenia.`;
      // if (foundZP.allowmvplan === false) {
      //   toast.warning(
      //     whatOrderType === "field_crops_works_order_to_hardener"
      //       ? textForOrderToHardener
      //       : textForOrderInternalTransport
      //   );
      //   return;
      // }

      const ZPInfo: ZPShortenedInfoWithoutTwrnzw = {
        ordnmb: foundZP.ordnmb,
        sordid: foundZP.ordid_,
        stkcnt: foundZP.stkcnt,
        scanned_raw_value: scannedValue,
      };
      setScannedValues((prev) => [...prev, ZPInfo]);
    }

    if (whatValueWasScanned === "tray") {
      //fetch tray
      const foundTray = await getTrayInfo_Rep113(
        token!,
        scannedValue,
        errorHandler
      );
      if (!foundTray) {
        toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
        return;
      }
      /** guard - allowmvplan has to be true -> turned off */
      // const textForOrderToHardener = `Data wywozu tego zlecenia na hartownik została już ustalona na dzień ${renderDateInPolishWay(
      //   foundTray.tmpmvplan
      // )}`;
      // const textForOrderInternalTransport = `Zlecono już transport dla tego zlecenia.`;
      // if (foundTray.allowmvplan === false) {
      //   toast.warning(
      //     whatOrderType === "field_crops_works_order_to_hardener"
      //       ? textForOrderToHardener
      //       : textForOrderInternalTransport
      //   );
      //   return;
      // }

      const ZPInfo: ZPShortenedInfoWithoutTwrnzw = {
        ordnmb: foundTray.ordnmb,
        sordid: foundTray.sordid,
        stkcnt: foundTray.stkcnt,
        scanned_raw_value: scannedValue,
      };

      if (!isZPScanned) setIsZPScanned(true);
      setScannedValues((prev) => [...prev, ZPInfo]);
    }
  }
};
