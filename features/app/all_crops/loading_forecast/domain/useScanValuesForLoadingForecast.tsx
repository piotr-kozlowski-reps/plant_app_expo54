import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useScanZpOrTrayRep113 } from "@/features/shared/data-access/useScanZpOrTrayRep113";
import {
  LoadingForecastInput,
  ZPLoadingForecastInfo,
} from "@/features/shared/types/interfaces-loading_forecast";
import { FormikProps } from "formik";
import { useAllowScanOnlyZpOrTray } from "@/features/shared/utils/useAllowScanOnlyZpOrTray";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { AllLoadingForecastSubmodules } from "@/features/shared/types/interfaces-auth";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";

export const useScanValuesForLoadingForecast = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  formik: FormikProps<LoadingForecastInput>,
  submoduleType: AllLoadingForecastSubmodules
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { checkWhatValueWasScanned, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] =
    useState<ZPLoadingForecastInfo | null>(null);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    const arrayOfAllowedScannedValues: TypeOfScannedValue[] =
      submoduleType === "greenhouse_crops_works_loading_forecast"
        ? ["zp_roz"]
        : ["tray", "zp_gru"];

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      arrayOfAllowedScannedValues
    );
    if (!isScannedDataCorrect) {
      return;
    }

    ///////
    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);

    try {
      setIsLoading(true);
      const scannedOrdnmb = getPureZPValue(scannedValue);

      //allowed conditions
      if (isScannedDataCorrect) {
        const foundZP = await getZPInfo_Rep113(
          token!,
          scannedOrdnmb,
          errorHandler
        );
        if (!foundZP) return;

        /** guards */
        //ZP not prepared to export to client
        if (!foundZP.outmvplan && !foundZP.outid_) {
          toast.warning(ERROR_MESSAGES.ZP_NOT_PREPARED_TO_EXPORT);
          return;
        }

        //there is already forecast set
        if (foundZP.outid_ && foundZP.outmvplan && foundZP.outcnt) {
          toast.warning(
            `Wprowadzono już prognozę załadunku dla tego zlecenia (${foundZP.outcnt} tac).`
          );
          return;
        }

        //there was no plants coming ups counted - turned off - it may come back
        if (!foundZP.risecnt) {
          toast.warning(
            `Nie przeliczono wschodów dla tego zlecenia (${foundZP.ordnmb}).`
          );
          return;
        }

        //order cannot be filled - not enough trays to fulfill order
        if (
          foundZP.risecnt &&
          foundZP.stkcnt &&
          foundZP.stkcnt < foundZP.risecnt
        ) {
          toast.warning(
            ERROR_MESSAGES.ORDER_HAS_NOT_ENOUGH_TRAYS_TO_FULFILL_ORDER
          );
        }

        //mapping
        const ZPInfo: ZPLoadingForecastInfo = {
          ordnmb: foundZP.ordnmb,
          sordid: foundZP.ordid_,
          twrnzw: foundZP.twrnzw,
          stkcnt: foundZP.stkcnt,
          cutid_: foundZP.cutid_,
          outcnt: foundZP.outcnt,
          outid_: foundZP.outid_,
          outmvplan: foundZP.outmvplan,
          risecnt: foundZP.risecnt,
          wsk_palet: foundZP.wsk_palet,
          scanned_raw_value: scannedValue,
        };

        //set quantity according to stkcnt in formik
        formik.setFieldValue(
          "traysQuantity",
          foundZP.risecnt + Math.ceil(foundZP.risecnt * 0.02)
        );

        //set zpInfo in formik to have access to zp data
        formik.setFieldValue("zpInfo", ZPInfo);

        setScannedValue(ZPInfo);

        return;
      }

      throw new Error(
        "useScanValuesForCutGRU -> scanValueHandler - condition not implemented."
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScannedValue = () => {
    setScannedValue(null);
  };

  //hook return
  return {
    qrLock,
    scannedValue,
    setQrLock,
    scanValueHandler,
    resetScannedValue,
  };
};
