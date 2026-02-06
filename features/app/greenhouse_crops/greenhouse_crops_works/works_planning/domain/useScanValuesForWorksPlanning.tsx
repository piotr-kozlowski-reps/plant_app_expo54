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
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";
import { useScanHelpers } from "@/features/shared/utils/useScanHelpers";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { toast } from "sonner-native";

export const useScanValuesForWorksPlanning = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  variant: WorksPlanningVariant,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { errorHandler } = useErrorHandler();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();
  const { getActivitiesList_Report143 } = useGetActivitiesListRep143();
  const { checkIfValueIsAlreadyScanned } = useScanHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { token } = useAuthSessionStore();
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();

  ////state
  const [scannedValues, setScannedValues] = useState<ZPInfoForWorkPlanning[]>(
    [],
  );
  const [ZPSelected, setZPSelected] = useState<ZPInfoForWorkPlanning | null>(
    null,
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
    const isScannedDataCorrect = checkIsScannedDataCorrect(scannedValue, [
      "zp_roz",
    ]);
    if (!isScannedDataCorrect) return;

    try {
      setIsLoading(true);

      const ordnmbValue = getPureZPValue(scannedValue);

      /** guards */
      if (
        checkIfValueIsAlreadyScanned<ZPShortenedInfoWithoutTwrnzw>(
          ordnmbValue,
          scannedValues,
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
        errorHandler,
      );

      // console.log({ zpRozActivities });
      // console.log({ variant });

      const zpRozActivitiesFiltered =
        variant === "greenhouse_crops_works_works_planning_tomato"
          ? zpRozActivities?.filter((item) => item.dscrpt.endsWith("POM"))
          : zpRozActivities?.filter((item) => item.dscrpt.endsWith("OGÓ"));

      if (!zpRozActivitiesFiltered) {
        toast.error(
          `Brak informacji o czynnościach na zeskanowanym ZPku (${ordnmbValue}).`,
        );
        return;
      }

      //is work to plan available for scanned ZP
      const foundWorkToPlan = zpRozActivitiesFiltered.find(
        (act) => act.dscrpt === workToPlan.ptc_kod,
      );
      if (!foundWorkToPlan) {
        toast.error(
          `Nie możesz zaplanować tej pracy. Nie ma jej na liście czynności do wykonania dla tego ZP (${ordnmbValue}).`,
        );
        return;
      }

      // console.log({ zpRozActivitiesFiltered });
      // console.log({ foundWorkToPlan });

      //check if ZP is Cucumber or Tomato, and guard if work that is to be planned can be planed for this variety
      const canWorkBePlannedForThisVariety =
        checkIfWorkCanBePlannedForThisVariety(zpRozActivities, foundWorkToPlan);
      if (!canWorkBePlannedForThisVariety.canBePlanned) {
        if (canWorkBePlannedForThisVariety.isCucumber) {
          toast.error(
            `Nie możesz zaplanować tej pracy. ZP, który zeskanowałeś (${ordnmbValue}) to ogórek, a chcesz zaplanować pracę dla pomidora.`,
          );
          return;
        }
        if (canWorkBePlannedForThisVariety.isTomato) {
          toast.error(
            `Nie możesz zaplanować tej pracy. ZP, który zeskanowałeś (${ordnmbValue}) to pomidor, a chcesz zaplanować pracę dla ogórka.`,
          );
          return;
        }

        throw new Error(
          "canWorkBePlannedForThisVariety => canWorkBePlannedForThisVariety => no tomato or cucumber but something else",
        );
      }

      //////
      //is variant of plant correct according to chosen work planning plant - tomato or cucumber
      if (!checkIfVariantIsCorrect(variant, zpRozActivitiesFiltered)) {
        if (variant === "greenhouse_crops_works_works_planning_tomato") {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada ogórka, a chcesz zaplanować pracę dla pomidora.`,
          );
        }
        if (variant === "greenhouse_crops_works_works_planning_cucumber") {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada pomidora, a chcesz zaplanować pracę dla ogórka.`,
          );
        }

        return;
      }

      //is work already done - status if different than null
      if (
        foundWorkToPlan.type__ === "TECH" &&
        foundWorkToPlan.status !== null
      ) {
        toast.error(ERROR_MESSAGES.WORK_TO_PLAN_IS_ALREADY_DONE);
        return;
      }

      if (
        foundWorkToPlan.type__ === "EXTRA" &&
        foundWorkToPlan.status !== null
      ) {
        toast.error(ERROR_MESSAGES.WORK_TO_PLAN_IS_ALREADY_PLANNED);
        return;
      }

      //is work already planned and plan is approved
      if (foundWorkToPlan.start_plan && foundWorkToPlan.stop_plan) {
        toast.error(ERROR_MESSAGES.PLAN_WAS_ALREADY_APPROVED);
        return;
      }

      //is work already planned and plan is not approved - but still cannot plan again
      // if (foundWorkToPlan.) {
      // //   toast.error(ERROR_MESSAGES.PLAN_WAS_ALREADY_APPROVED);
      // //   return;
      // }

      const foundZP = await getZPInfo_Rep113(token!, ordnmbValue, errorHandler);
      if (!foundZP) {
        toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
        return;
      }

      //activityId
      const id = foundWorkToPlan.id;
      const activityId = foundWorkToPlan.activityid;

      if (!id && !activityId)
        throw new Error(
          "useScanValuesForWorksPlanning -> scanValueHandler -> activityId && id not found",
        );

      let rozActivityId = id && id !== 0 ? id : activityId!;

      const ZPInfo: ZPInfoForWorkPlanning = {
        ordnmb: foundZP.ordnmb,
        sordid: foundZP.ordid_,
        stkcnt: foundZP.stkcnt,
        rozActivityId: rozActivityId,
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
        ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW,
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
      (zp) => zp.ordnmb !== zpInfo.ordnmb,
    );
    setScannedValues(updatedValues);
  };

  //helpers
  function checkIfVariantIsCorrect(
    variant: WorksPlanningVariant,
    zpRozActivities: ZpRozActivity[],
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

  function checkIfWorkCanBePlannedForThisVariety(
    zpRozActivities: ZpRozActivity[] | null,
    foundWorkToPlan: ZpRozActivity,
  ):
    | { canBePlanned: true }
    | { canBePlanned: false; isTomato: boolean; isCucumber: boolean } {
    if (!zpRozActivities) {
      throw new Error(
        "checkIfWorkCanBePlannedForThisVariety -> !zpRozActivities",
      );
    }

    const isZPCucumber = zpRozActivities.find(
      (zp) => zp.type__ === "TECH" && zp.dscrpt.endsWith("OGÓ"),
    );
    const isZPTomato = zpRozActivities.find(
      (zp) => zp.type__ === "TECH" && zp.dscrpt.endsWith("POM"),
    );

    if (!isZPTomato && !isZPCucumber) {
      throw new Error(
        "checkIfWorkCanBePlannedForThisVariety -> zp is neither Tomato nor Cucumber",
      );
    }

    if (isZPCucumber) {
      const canBeSent = foundWorkToPlan.dscrpt.endsWith("OGÓ");
      return canBeSent
        ? { canBePlanned: true }
        : { canBePlanned: false, isCucumber: true, isTomato: false };
    }
    if (isZPTomato) {
      const canBeSent = foundWorkToPlan.dscrpt.endsWith("POM");
      return canBeSent
        ? { canBePlanned: true }
        : { canBePlanned: false, isCucumber: false, isTomato: true };
    }

    throw new Error(
      "checkIfWorkCanBePlannedForThisVariety -> found work cannot be matched with neither Tomato nor Cucumber",
    );
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
