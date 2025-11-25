import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useGetActivitiesListRep143 } from "@/features/shared/data-access/useGetActivitiesListRep143";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { ZpRozActivity } from "@/features/shared/types/interfaces-activities_list";
import {
  WorksPlanningVariant,
  WorkToPlan,
  ZPInfoForWorkPlanning,
} from "@/features/shared/types/interfaces-works_planning";
import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { useScanHelpers } from "@/features/shared/utils/useScanHelpers";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { toast } from "sonner-native";

export const useScanValuesForWorksPlanning = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  variant: WorksPlanningVariant
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { errorHandler } = useErrorHandler();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();
  const { getActivitiesList_Report143 } = useGetActivitiesListRep143();
  const { checkIfValueIsAlreadyScanned } = useScanHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { token } = useAuthSessionStore();

  ////state
  const [scannedValues, setScannedValues] = useState<ZPInfoForWorkPlanning[]>(
    []
  );
  const [ZPSelected, setZPSelected] = useState<ZPInfoForWorkPlanning | null>(
    null
  );
  const [workToPlan, setWorkToPlan] = useState<WorkToPlan | null>(null);
  const [inHowManyDays, setInHowManyDays] = useState<number | null>(3);

  //modals
  const [isShowModalWorkToChoose, setIsShowModalWorkToChoose] = useState(true);
  const [isShowModalWithInHowManyDays, setIsShowModalWithInHowManyDays] =
    useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  ////fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["zp_roz"]
    );
    if (!isScannedDataCorrect) return;

    try {
      setIsLoading(true);

      const ordnmbValue = getPureZPValue(scannedValue);

      /** guards */
      if (
        checkIfValueIsAlreadyScanned<ZPShortenedInfoWithoutTwrnzw>(
          ordnmbValue,
          scannedValues
        )
      ) {
        toast.warning(ERROR_MESSAGES.ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST);
        return;
      }

      if (!workToPlan) {
        toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_WORK_TO_PLAN);
        return;
      }

      const zpRozActivities = await getActivitiesList_Report143(
        ordnmbValue,
        errorHandler
      );

      if (!zpRozActivities) {
        toast.error(
          `Brak informacji o czynnościach na zeskanowanym ZPku (${ordnmbValue}).`
        );
        return;
      }

      //is work to plan available for scanned ZP
      const foundWorkToPlan = zpRozActivities.find(
        (act) => act.dscrpt === workToPlan.ptc_kod
      );
      if (!foundWorkToPlan) {
        toast.error(
          `Nie możesz zaplanować tej pracy. Nie ma jej na liście czynności do wykonania dla tego ZP (${ordnmbValue}).`
        );
        return;
      }
      //is variant of plant correct according to chosen work planning plant - tomato or cucumber
      if (!checkIfVariantIsCorrect(variant, zpRozActivities)) {
        if (variant === "greenhouse_crops_works_works_planning_tomato") {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada ogórka, a chcesz zaplanować pracę dla pomidora.`
          );
        }
        if (variant === "greenhouse_crops_works_works_planning_cucumber") {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada pomidora, a chcesz zaplanować pracę dla ogórka.`
          );
        }

        return;
      }
      //is work already done - status if different than null
      if (foundWorkToPlan.status !== null) {
        toast.error(ERROR_MESSAGES.WORK_TO_PLAN_IS_ALREADY_DONE);
        return;
      }

      const foundZP = await getZPInfo_Rep113(token!, ordnmbValue, errorHandler);
      if (!foundZP) {
        toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
        return;
      }
      const ZPInfo: ZPInfoForWorkPlanning = {
        ordnmb: foundZP.ordnmb,
        sordid: foundZP.ordid_,
        stkcnt: foundZP.stkcnt,
        rozActivityId: foundWorkToPlan.id,
        scanned_raw_value: scannedValue,
      };
      setScannedValues((prev) => [...prev, ZPInfo]);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  function setTargetWorkToPlanHandler(workToPlan: WorkToPlan) {
    setWorkToPlan(workToPlan);
  }
  const changeInHowManyDaysHandler = (inHowManyDaysInput: number) => {
    /** guard: cannot order to todays and tomorrows date when is after 13:00 */
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDaysInput < 3 && !isPossibleToProcess_Before13) {
      toast.warning(
        ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW
      );
      return;
    }

    setInHowManyDays(inHowManyDaysInput);
  };
  const clearScannedValues = () => {
    setScannedValues([]);
    setWorkToPlan(null);
    setInHowManyDays(3);
  };
  const deleteValueFromList = (zpInfo: ZPInfoForWorkPlanning | null): void => {
    if (zpInfo === null) {
      toast.warning(ERROR_MESSAGES.ZP_CANNOT_BE_DELETED_NO_INFO);
      return;
    }

    toast.success(MESSAGES.ZP_DELETED_SUCCESS_FROM_LIST);
    const updatedValues = scannedValues.filter(
      (zp) => zp.ordnmb !== zpInfo.ordnmb
    );
    setScannedValues(updatedValues);
  };

  //helpers
  function checkIfVariantIsCorrect(
    variant: WorksPlanningVariant,
    zpRozActivities: ZpRozActivity[]
  ): boolean {
    if (!zpRozActivities.length) {
      throw new Error("checkIfVariantIsCorrect -> !zpRozActivities.length");
    }

    const workName = zpRozActivities[0].dscrpt;
    if (
      variant === "greenhouse_crops_works_works_planning_tomato" &&
      !workName.endsWith("POM")
    ) {
      return false;
    }
    if (
      variant === "greenhouse_crops_works_works_planning_cucumber" &&
      !workName.endsWith("OGÓ")
    ) {
      return false;
    }

    return true;
  }

  return {
    isShowModalWorkToChoose,
    workToPlan,
    inHowManyDays,
    isShowModalWithInHowManyDays,
    scannedValues,
    isShowDeleteModal,
    ZPSelected,

    setZPSelected,
    setIsShowDeleteModal,
    setIsShowModalWithInHowManyDays,
    scanValueHandler,
    setIsShowModalWorkToChoose,
    setTargetWorkToPlanHandler,
    changeInHowManyDaysHandler,
    clearScannedValues,
    deleteValueFromList,
  };
};
