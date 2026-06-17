import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useState } from "react";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import * as Haptics from "expo-haptics";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import {
  LoadingForecastInput,
  ZPLoadingForecastInfo,
} from "@/features/shared/types/interfaces-loading_forecast";
import { FormikProps } from "formik";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { AllLoadingForecastSubmodules } from "@/features/shared/types/interfaces-auth";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";

/**
 * @public
 * @topic
 * @order 20
 * REALIZACJA:
 */
/**
 * @public
 * @procedureItem
 * Skan QR ZP lub tacy
 */
export const useScanValuesForLoadingForecast = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  formik: FormikProps<LoadingForecastInput>,
  submoduleType: AllLoadingForecastSubmodules,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { checkWhatValueWasScanned, getPureZPValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [scannedValue, setScannedValue] =
    useState<ZPLoadingForecastInfo | null>(null);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    /**
     * @public
     * @guard
     * dla <b>GRU</b>
     * dopuszczone są tylko ZP z końcówka '/GRU' lub tace
     */
    /**
     * @public
     * @guard
     * dla <b>ROZ</b>
     * dopuszczone są tylko ZP z końcówka '/ROZ'
     */
    const arrayOfAllowedScannedValues: TypeOfScannedValue[] =
      submoduleType === "greenhouse_crops_works_loading_forecast"
        ? ["zp_roz"]
        : ["tray", "zp_gru"];

    const isRoz = submoduleType === "greenhouse_crops_works_loading_forecast";

    //check allowed scanned values
    const isScannedDataCorrect = checkIsScannedDataCorrect(
      scannedValue,
      arrayOfAllowedScannedValues,
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
      /**
       * @public
       * @procedureItem
       * raporty:
       * @readFile `features/shared/data-access/useGetZPInfo_Report113.tsx`
       */
      if (isScannedDataCorrect) {
        const foundZP = await getZPInfo_Rep113(
          token!,
          scannedOrdnmb,
          errorHandler,
        );
        if (!foundZP) return;

        /** guards */
        /**
         * @public
         * @guard
         * zabezpieczenie: parametr: <b>outmvplan === false</b> && <b>outid_ === false</b>
         * (to znaczy, że zlecenie nie jest jeszcze przygotowane do transportu -> koniec procedury )
         */
        if (!foundZP.outmvplan && !foundZP.outid_) {
          toast.warning(ERROR_MESSAGES.ZP_NOT_PREPARED_TO_EXPORT);
          return;
        }

        /**
         * @public
         * @guard
         * zabezpieczenie: parametry: <b>outid_ && outmvplan && outcnt</b>
         * (to znaczy, że wprowadzono już prognozę załadunku dla tego zlecenia -> info + koniec procedury )
         */
        if (foundZP.outid_ && foundZP.outmvplan && foundZP.outcnt) {
          toast.warning(
            `Wprowadzono już prognozę załadunku dla tego zlecenia (${
              foundZP.outcnt
            } ${isRoz ? "kostek" : "tac"}).`,
          );
          return;
        }

        /**
         * @public
         * @guard
         * zabezpieczenie: parametry: <b>risecnt === null</b>
         * (to znaczy, że nie przeliczono wschodów -> info + koniec procedury )
         */
        if (!foundZP.risecnt) {
          toast.warning(
            `Nie przeliczono wschodów dla tego zlecenia (${foundZP.ordnmb}).`,
          );
          return;
        }

        //order cannot be filled - not enough trays to fulfill order
        /**
         * @public
         * @guard
         * zabezpieczenie: parametry: <b>risecnt && stkcnt && stkcnt < risecnt</b>
         * (nie ma wystarczającej ilości roślin po przeliczeniu wschodów. -> <b>tylko info</b>  )
         */
        if (
          foundZP.risecnt &&
          foundZP.stkcnt &&
          foundZP.stkcnt < foundZP.risecnt
        ) {
          toast.warning(
            ERROR_MESSAGES.ORDER_HAS_NOT_ENOUGH_TRAYS_TO_FULFILL_ORDER,
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
        /**
         * @public
         * @procedureItem
         * @order 50
         * Podpowiadana wartość dla "traysQuantity" to foundZP.risecnt + 2%
         */
        formik.setFieldValue(
          "traysQuantity",
          foundZP.risecnt + Math.ceil(foundZP.risecnt * 0.02),
        );

        //set zpInfo in formik to have access to zp data
        formik.setFieldValue("zpInfo", ZPInfo);

        setScannedValue(ZPInfo);

        return;
      }

      throw new Error(
        "useScanValuesForCutGRU -> scanValueHandler - condition not implemented.",
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
