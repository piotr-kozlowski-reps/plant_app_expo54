import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useScanHelpers } from "@/features/shared/utils/useScanHelpers";
import { useScannedValuesForZP } from "../../../../all_crops/orders_all/domain/useScannedValuesForZP";
import {
  ZPInLocalizationInfo,
  ZPShortenedInfoWithoutTwrnzw,
} from "@/features/shared/types/interfaces-zp";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { InfoModal } from "@/features/shared/types/interfaces-general";

export const useScanValuesForOrderNitrogenIrrigation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValuesForProtectiveTreatments: () => void,
  nitrogenIrrigationList: ZpToNitrogenIrrigation[]
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureZPValue, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { scanField, checkIfValueIsAlreadyScanned } = useScanHelpers();
  const { errorHandler } = useErrorHandler();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { token } = useAuthSessionStore();
  const { renderDateInPolishWay } = useDatesHelper();

  ////states

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
    setIsZPScanned
  );

  //modals
  const [isShowModalWithInHowManyDays, setIsShowModalWithInHowManyDays] =
    useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowInfoConfirmationModal, setIsShowInfoConfirmationModal] =
    useState(false);

  const [infoModalDetails, setInfoModalDetails] = useState<InfoModal | null>(
    null
  );
  const showInfoConfirmationModal = (
    title: string,
    confirmationButtonName: string,
    info1: string,
    info2?: string
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

  //force to change today's or tomorrow's day when after 13:00
  useEffect(() => {
    if (!inHowManyDays || inHowManyDays > 1) return;

    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDays < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      setIsShowModalWithInHowManyDays(true);
    }
  }, [inHowManyDays]);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /** guards */

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["zp_gru", "field"]
    );
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isZP = whatValueWasScanned === "zp_gru";
    const isField = whatValueWasScanned === "field";

    try {
      setIsLoading(true);

      //allowed conditions
      if (isField) {
        /** guards callbacks */

        /**
         * guard passes when no ZPs from field is in list of already ordered ZPs, but even if there are some, it's ok, it returns true
         * -> informing user that there's such a case
         *
         * @param foundZPsPerLocalization
         * @returns boolean
         */
        const guard_passesWhen_NoZpFromFieldIsInListOfAlreadyOrderedZps_Callback =
          (foundZPsPerLocalization: ZPInLocalizationInfo[]) => {
            for (const zpInLoc of foundZPsPerLocalization) {
              for (const zpFrpNitrogenList of nitrogenIrrigationList) {
                if (zpInLoc.ordnmb === zpFrpNitrogenList.ordnmb) {
                  showInfoConfirmationModal(
                    "Uwaga",
                    "Potwierdzam",
                    "W lokalizacji znajduje się co najmniej jeden ZPek, który został już zlecony do podlewania azotem. Aktualne zlecenie zostanie ustawione dla wszystkich ZPeków w lokalizacji, poza tymi, które zostały zlecone wcześniej.",
                    "Jeżeli lista jest pusta, to albo nie ma żadnych ZPków w lokalizacji, albo wszystkie są już zlecone do podlewania azotem."
                  );
                  return true;
                }
              }
            }
            return true;
          };

        /** filter callbacks */
        const filter_filterOutZpsFromFieldWhenAreInListOfAlreadyOrderedZpsToIrrigateWithNitrogen_Callback =
          (
            foundZPsPerLocalization: ZPInLocalizationInfo[]
          ): ZPInLocalizationInfo[] => {
            const filteredElements: ZPInLocalizationInfo[] = [];
            for (const zpInLoc of foundZPsPerLocalization) {
              let isInList = false;
              for (const zpFromNitrogenList of nitrogenIrrigationList) {
                if (isInList) break;
                if (zpInLoc.ordnmb === zpFromNitrogenList.ordnmb) {
                  isInList = true;
                }
              }

              if (!isInList) filteredElements.push(zpInLoc);
            }

            return filteredElements;
          };

        await scanField({
          scannedValue,
          isZPScanned,
          warning_message: ERROR_MESSAGES.NO_ZP_ON_FIELD,
          setIsFieldScanned,
          setScannedValues,
          isToFilterByMvplok: false,
          callbacksGuards: [
            guard_passesWhen_NoZpFromFieldIsInListOfAlreadyOrderedZps_Callback,
          ],
          callbacksFilters: [
            filter_filterOutZpsFromFieldWhenAreInListOfAlreadyOrderedZpsToIrrigateWithNitrogen_Callback,
          ],
        });
        return;
      }

      if (isZP) {
        await scanZpForOrderNitrogenIrrigationHandler(
          scannedValue,
          nitrogenIrrigationList
        );
        return;
      }

      throw new Error(
        "useScanValuesForOrderNitrogenIrrigation -> scanValueHandler - condition not implemented."
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
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

  const resetValues = () => {
    setInHowManyDays(1);
    resetValuesForProtectiveTreatments();
    setIsFieldScanned(false);
    setIsZPScanned(false);
    setZPSelected(null);
    setScannedValues([]);
  };

  //hook return
  return {
    qrLock,
    isFieldScanned,
    isZPScanned,
    scannedValues,
    isShowModalWithInHowManyDays,
    inHowManyDays,
    isShowDeleteModal,
    ZPSelected,
    infoModalDetails,
    isShowInfoConfirmationModal,

    setZPSelected,
    setIsShowDeleteModal,
    setInHowManyDays,
    setIsShowModalWithInHowManyDays,
    setQrLock,
    scanValueHandler,
    changeInHowManyDaysHandler,
    deleteValueFromList,
    resetValues,
    hideInfoConfirmationModal,
  };

  /** helpers */
  async function scanZpForOrderNitrogenIrrigationHandler(
    scannedValue: string,
    nitrogenIrrigationList: ZpToNitrogenIrrigation[]
  ) {
    /** guards */
    //check if scanned ZP
    if (checkWhatValueWasScanned(scannedValue) !== "zp_gru") {
      toast.warning(ERROR_MESSAGES.ONLY_ZP_POSSIBLE);
    }

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

    //check if scanned ZP was on nitrogen irrigation list
    const foundZPOnNitrogenList = nitrogenIrrigationList.find(
      (zp) => zp.ordnmb === scannedOrdnmb
    );
    if (foundZPOnNitrogenList) {
      toast.warning(
        `To zlecenie (${
          foundZPOnNitrogenList.ordnmb
        }) już zaplanowano na: ${renderDateInPolishWay(
          foundZPOnNitrogenList.nitrogen_irrigation_date
        )}`
      );
      return;
    }

    if (!isZPScanned)
      /** logic */
      setIsZPScanned(true);

    /** fetch ZP */
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
