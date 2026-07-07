import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import {
  ZPInLocalizationInfo,
  ZPShortenedInfoWithoutTwrnzw,
} from "@/features/shared/types/interfaces-zp";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useScanHelpers } from "@/features/shared/utils/useScanHelpers";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useScannedValuesForZP } from "@/features/app/all_crops/orders_all/domain/useScannedValuesForZP";
import { InfoModal } from "@/features/shared/types/interfaces-general";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { toast } from "sonner-native";
import { ZpToChemicalTreatments } from "@/features/shared/types/interfaces-chemical_treatments_don";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

export const useScanValuesForOrderChemicalTreatments = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValuesForChemicalTreatments: () => void,
  chemicalTreatmentsDonList: ZpToChemicalTreatments[],
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();
  const { checkWhatValueWasScanned, getPureZPValue, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { scanField, checkIfValueIsAlreadyScanned } = useScanHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { token } = useAuthSessionStore();

  //values
  const [qrLock, setQrLock] = useState(true);
  const [inHowManyDays, setInHowManyDays] = useState<number | null>(1);
  const [isFieldScanned, setIsFieldScanned] = useState(false);
  const [isZPScanned, setIsZPScanned] = useState(false);
  const [ZPSelected, setZPSelected] =
    useState<ZPShortenedInfoWithoutTwrnzw | null>(null);

  //scannedValues
  const { scannedValues, setScannedValues } = useScannedValuesForZP(
    isFieldScanned,
    setIsFieldScanned,
    isZPScanned,
    setIsZPScanned,
  );

  //modals
  const [isShowModalWithInHowManyDays, setIsShowModalWithInHowManyDays] =
    useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowInfoConfirmationModal, setIsShowInfoConfirmationModal] =
    useState(false);
  const [infoModalDetails, setInfoModalDetails] = useState<InfoModal | null>(
    null,
  );

  //fn helpers
  const showInfoConfirmationModal = (
    title: string,
    confirmationButtonName: string,
    info1: string,
    info2?: string,
  ) => {
    setInfoModalDetails({
      title,
      info1,
      info2,
      confirmationButtonName,
    });
    setIsShowInfoConfirmationModal(true);
  };

  const hideInfoConfirmationModal = () => {
    setIsShowInfoConfirmationModal(false);
  };

  const changeInHowManyDaysHandler = (inHowManyDaysInput: number) => {
    /** guard: cannot order to todays and tomorrows date when is after 13:00 */
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDaysInput < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    setInHowManyDays(inHowManyDaysInput);
  };

  //fn
  /**
   * @public
   * @procedureItem
   * @order 130
   * skan QR kod: lokalizacja lub ZP
   */
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * zabezpieczenie: dostępne tylko skanowanie <b>zp_don</b> lub <b>calej nawy</b>
     */
    const isScannedDataCorrect = checkIsScannedDataCorrect(scannedValue, [
      "zp_don",
      "field",
    ]);
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isZP = whatValueWasScanned === "zp_don";
    const isField = whatValueWasScanned === "field";

    try {
      setIsLoading(true);

      //field scanned
      if (isField) {
        /** guards callbacks */
        /**
         * @public
         * @guard
         * zabezpieczenie: <b>tylko informacja</b>, jeżeli w lokalizacji znajduje się <b>ZPek, który nie jest ZPekiem DON</b>,
         * to <b>info dla klienta</b> i , mimo to, zlecenie całej nawy jest przesyłane dalej.
         */
        const guard_OnlyInfo_ZpFromFieldIsNotZpDon_Callback = (
          foundZPsPerLocalization: ZPInLocalizationInfo[],
        ) => {
          for (const zpInLoc of foundZPsPerLocalization) {
            const isZpDon = zpInLoc.ordnmb.endsWith("DON");
            if (!isZpDon) {
              showInfoConfirmationModal(
                "Uwaga",
                "Potwierdzam",
                "W lokalizacji znajduje się co najmniej jeden ZPek, który nie jest ZPekiem DON. Mimo to, aktualne zlecenie zostanie ustawione dla wszystkich ZPeków w lokalizacji.",
              );
              return true;
            }
          }
          return true;
        };

        /**
         * @public
         * @procedureItem
         * raporty:
         * @readFile `features/shared/utils/useScanHelpers.tsx`
         */
        await scanField({
          scannedValue,
          isZPScanned,
          warning_message: ERROR_MESSAGES.NO_ZP_ON_FIELD,
          setIsFieldScanned,
          setScannedValues,
          isToFilterByMvplok: false,
          callbacksGuards: [guard_OnlyInfo_ZpFromFieldIsNotZpDon_Callback],
          callbacksFilters: [],
        });

        return;
      }

      //zp scanned
      if (isZP) {
        await scanZpForOrderChemicalTreatmentsHandler(
          scannedValue,
          chemicalTreatmentsDonList,
        );
        return;
      }

      //bad value scanned
      throw new Error(
        "useScanValuesForOrderChemicalTreatments -> scanValueHandler - condition not implemented.",
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    qrLock,
    isFieldScanned,
    isShowInfoConfirmationModal,
    infoModalDetails,
    scannedValues,
    inHowManyDays,
    isShowModalWithInHowManyDays,

    setQrLock,
    scanValueHandler,
    hideInfoConfirmationModal,
    setIsShowDeleteModal,
    setZPSelected,
    setIsShowModalWithInHowManyDays,
    changeInHowManyDaysHandler,
  };

  /** helpers */
  async function scanZpForOrderChemicalTreatmentsHandler(
    scannedValue: string,
    chemicalTreatmentsDonList: ZpToChemicalTreatments[],
  ) {
    /** guards */
    //check if scanned ZP
    if (checkWhatValueWasScanned(scannedValue) !== "zp_don") {
      toast.warning(ERROR_MESSAGES.ONLY_ZP_DON_POSSIBLE);
    }

    //check if ZP is already on list
    const scannedOrdnmb = getPureZPValue(scannedValue);
    if (
      checkIfValueIsAlreadyScanned<ZPShortenedInfoWithoutTwrnzw>(
        scannedOrdnmb,
        scannedValues,
      )
    ) {
      toast.warning(ERROR_MESSAGES.ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST);
      return;
    }

    if (!isZPScanned) setIsZPScanned(true);

    /** fetch ZP */
    /**
     * @public
     * @procedureItem
     * raporty - zapytanie o ZP:
     * @readFile `features/shared/data-access/useScanZpOrTrayRep113.tsx`
     */
    const foundZP = await getZPInfo_Rep113(token!, scannedOrdnmb, errorHandler);
    if (!foundZP) {
      toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
      return;
    }

    /** update */
    const ZPInfo: ZPShortenedInfoWithoutTwrnzw = {
      ordnmb: foundZP.ordnmb,
      sordid: foundZP.ordid_,
      stkcnt: foundZP.stkcnt,
      scanned_raw_value: scannedValue,
    };
    setScannedValues((prev) => [...prev, ZPInfo]);
  }
};
