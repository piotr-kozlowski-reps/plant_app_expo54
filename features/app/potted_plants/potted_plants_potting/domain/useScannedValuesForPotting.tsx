import { useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import * as Haptics from "expo-haptics";
import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { ZPDetailedInfo } from "@/features/shared/types/interfaces-zp";
import { useGetActivitiesListRep143 } from "@/features/shared/data-access/useGetActivitiesListRep143";

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
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();

  /** state */
  //scanner
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] = useState<ZPDetailedInfo | null>(null);

  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * @order 20
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
      (activity) => activity.dscrpt === "DONICZKOWANIE RD",
    );

    if (!foundPottingActivity) {
      toast.error(ERROR_MESSAGES.POTTING_ACTIVITY_NOT_FOUND);
      return;
    }

    console.log({ zpRozActivities });

    // setScannedValue(zpInfo);
  };

  ////return
  return {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
  };
};
