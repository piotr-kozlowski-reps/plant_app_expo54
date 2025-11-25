import * as Haptics from "expo-haptics";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import {
  ActivityVariant,
  ZpRozActivity,
  ZpRozActivityDetails,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import { toast } from "sonner-native";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useGetActivitiesListRep143 } from "@/features/shared/data-access/useGetActivitiesListRep143";

export const useScanValuesForGreenhouseCropsActionsConfirmation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  variant: ActivityVariant
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getActivitiesList_Report143 } = useGetActivitiesListRep143();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();

  //states
  const [scannedValue, setScannedValue] = useState<ZpRozWithActivities | null>(
    null
  );
  const [currentActivity, setCurrentActivity] = useState<ZpRozActivity | null>(
    null
  );
  const [currentActivityDetails, setCurrentActivityDetails] =
    useState<ZpRozActivityDetails | null>(null);

  //modals
  const [isShowConfirmActivityModal, setIsShowConfirmActivityModal] =
    useShowModal();
  const [isShowQuantityModal, setShowQuantityModal] = useShowModal(false);

  //fn
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
      // const zpRozActivities = await queryClient.fetchQuery({
      //   queryKey: [QUERY_KEYS.ACTIVITIES_PER_ZP, ordnmbValue],
      //   queryFn: () => getActivitiesList_Report143(ordnmbValue, errorHandler),
      // });

      const zpRozActivities = await getActivitiesList_Report143(
        ordnmbValue,
        errorHandler
      );

      /** guards */
      //any activities returned in list?
      if (!zpRozActivities) {
        toast.error(
          `Brak informacji o czynnościach na zeskanowanym ZPku (${ordnmbValue}).`
        );
        return;
      }

      //check if scanned ZP is tomato or cucumber and if that suits chosen earlier variant
      if (!checkIfVariantIsCorrect(variant, zpRozActivities)) {
        if (variant === "greenhouse_crops_works_activity_confirmation_tomato") {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada ogórka, a chcesz potwierdzić pracę dla pomidora.`
          );
        }
        if (
          variant === "greenhouse_crops_works_activity_confirmation_cucumber"
        ) {
          toast.error(
            `Wybrałeś zły ZP (${ordnmbValue}), to rozsada pomidora, a chcesz potwierdzić pracę dla ogórka.`
          );
        }
        return;
      }

      setScannedValue({
        ordnmb: ordnmbValue,
        activities: zpRozActivities,
        scannedRawValue: scannedValue,
      });
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionConfirmationModal = (activity: ZpRozActivity) => {
    setCurrentActivity(activity);
    setIsShowConfirmActivityModal(true);
  };
  const closeActionConfirmationModal = () => {
    setCurrentActivity(null);
    setIsShowConfirmActivityModal(false);
  };

  const openActivityQuantityModal = (activityDetails: ZpRozActivityDetails) => {
    setCurrentActivityDetails(activityDetails);
    setShowQuantityModal(true);
  };
  const closeActivityQuantityModal = () => {
    setCurrentActivityDetails(null);
    setShowQuantityModal(false);
  };

  const goBackToScanner = () => {
    setScannedValue(null);
    setCurrentActivity(null);
    setCurrentActivityDetails(null);
  };
  const refetchActivitiesData = async () => {
    setScannedValue(null);
    // console.log("refetchActivitiesData fn");
    // console.log({ scannedValue });

    // if (!scannedValue || !currentActivity) {
    //   toast.error(ERROR_MESSAGES.CANNOT_AUTOMATICALLY_UPDATE);
    //   return;
    // }

    // const newZpRozActivities = await getActivitiesList_Report143(
    //   scannedValue.ordnmb,
    //   errorHandler
    // );

    // if (!newZpRozActivities) {
    //   toast.error(ERROR_MESSAGES.CANNOT_AUTOMATICALLY_UPDATE);
    //   return;
    // }

    // const newScannedValue = {
    //   ...scannedValue,
    //   activities: newZpRozActivities,
    // };
    // const newCurrentActivity = newZpRozActivities.find(
    //   (act) => act.id === currentActivity.id
    // );

    // if (!newCurrentActivity) {
    //   toast.error(ERROR_MESSAGES.CANNOT_AUTOMATICALLY_UPDATE);
    //   return;
    // }

    // console.log({ currentActivity });
    // console.log({ newScannedValue });
    // console.log({ newCurrentActivity });

    // setScannedValue(newScannedValue);
    // setCurrentActivity(newCurrentActivity);
    // setCurrentActivityDetails(null);

    //////////////
    //   const newZpRozActivities = await queryClient.fetchQuery({
    //     queryKey: [QUERY_KEYS.ACTIVITIES_PER_ZP, scannedValue?.ordnmb],
    //     queryFn: () =>
    //       getActivitiesList_Report143(
    //         scannedValue ? scannedValue.ordnmb : "",
    //         errorHandler
    //       ),
    //   });

    //   if (!newZpRozActivities) {
    //     toast.error(
    //       `Brak możliwości uaktualnienia danych automatycznie, wyjdź z tego modułu i zeskanuj ZP raz jeszcze.`
    //     );
    //     return;
    //   }

    //   setScannedValue((prev) => {
    //     if (prev === null) return null;
    //     return {
    //       ...prev,
    //       activities: newZpRozActivities,
    //     };
    //   });
  };

  /** helpers */
  function checkIfVariantIsCorrect(
    variant: ActivityVariant,
    zpRozActivities: ZpRozActivity[]
  ): boolean {
    if (!zpRozActivities.length) {
      throw new Error("checkIfVariantIsCorrect -> !zpRozActivities.length");
    }

    const workName = zpRozActivities[0].dscrpt;
    if (
      variant === "greenhouse_crops_works_activity_confirmation_tomato" &&
      !workName.endsWith("POM")
    ) {
      return false;
    }
    if (
      variant === "greenhouse_crops_works_activity_confirmation_cucumber" &&
      !workName.endsWith("OGÓ")
    ) {
      return false;
    }

    return true;
  }

  return {
    scannedValue,
    currentActivity,
    isShowConfirmActivityModal,
    isShowQuantityModal,
    currentActivityDetails,

    setShowQuantityModal,
    scanValueHandler,
    openActionConfirmationModal,
    closeActionConfirmationModal,
    openActivityQuantityModal,
    closeActivityQuantityModal,
    goBackToScanner,
    refetchActivitiesData,
  };
};
