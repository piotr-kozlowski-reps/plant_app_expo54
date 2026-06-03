import { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { ZPInfoForPotting } from "@/features/shared/types/interfaces-zp";
import { useGetActivitiesListRep143 } from "@/features/shared/data-access/useGetActivitiesListRep143";
import { useGetActivityDetailsRep144 } from "@/features/shared/data-access/useGetActivityDetailsRep144";
import { useFindMaterialWithDoni } from "./useFindMaterialWithDoni";

export const useScannedValuesForPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { getActivitiesList_Report143 } = useGetActivitiesListRep143();
  const { getActivityDetails_Report144 } = useGetActivityDetailsRep144();
  const { findMaterialWithDoni } = useFindMaterialWithDoni();

  /** state */
  //scanner
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZPInfoForPotting | null>(
    null,
  );

  const resetValues = () => {
    setScannedValue(null);
  };

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @topic
     * @order 20
     * REALIZACJA:
     */
    /**
     * @public
     * @guard
     * zeskanowany ZP'ek musi być z ZPekiem z końcówką 'DON' -> jak nie? koniec procedury.
     */
    const isValueZpDon = checkWhatValueWasScanned(scannedValue);
    if (isValueZpDon !== "zp_don") {
      toast.warning(ERROR_MESSAGES.SCANNED_ZP_IS_NOT_DON_ZP);
      return;
    }

    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGetActivitiesListRep143.tsx`
     */
    const zpPureValue = getPureZPValue(scannedValue);
    const zpRozActivities = await getActivitiesList_Report143(
      zpPureValue,
      errorHandler,
    );

    /**
     * @public
     * @guard
     * jeżeli raport nie zwróci czynności  z atrybutem  "dscrpt": "DONICZKOWANIE RD" -> info i koniec procedury.
     */
    if (!zpRozActivities || !zpRozActivities.length) {
      toast.error(
        `Brak informacji o czynnościach na zeskanowanym ZPku (${zpPureValue}).`,
      );
      return;
    }

    const foundPottingActivity = zpRozActivities.find(
      (activity) =>
        activity.dscrpt === "DONICZKOWANIE RD" && activity.type__ === "TECH",
    );

    if (!foundPottingActivity) {
      toast.error(ERROR_MESSAGES.POTTING_ACTIVITY_NOT_FOUND);
      return;
    }

    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGetActivityDetailsRep144.tsx`
     */

    const pcz_id = foundPottingActivity.pcz_id;
    const activityDetails = await getActivityDetails_Report144(
      pcz_id,
      errorHandler,
    );

    /**
     * @public
     * @guard
     * jeżeli raport nie zwróci materiału z atrybutem  "twr_kod" rozpoczynającym się od "DONI." -> info i koniec procedury.
     */
    if (!activityDetails || !activityDetails.length) {
      toast.error(
        `Brak informacji o materiałach na zeskanowanym ZPku (${zpPureValue}).`,
      );
      return;
    }

    const foundMaterialWithDoni = findMaterialWithDoni(activityDetails);

    if (!foundMaterialWithDoni) {
      toast.error(ERROR_MESSAGES.POTTING_ACTIVITY_MATERIAL_WITH_DONI_NOT_FOUND);
      return;
    }

    setScannedValue({
      ...foundPottingActivity,
      materials: activityDetails,
      ordnmb: zpPureValue,
      scannedRawValue: scannedValue,
    });
  };

  ////return
  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
    resetValues,
  };
};
