import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useState } from "react";
import { toast } from "sonner-native";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useScannedValuesForExtraWorks } from "@/features/shared/utils/useScannedValuesForExtraWorks";
import { useGuard_CheckDataToBeScanned_ReturnFunction } from "@/features/shared/utils/useGuard_CheckDataToBeScanned_ReturnFunction";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { useScanValueForExtraWorkHandler } from "@/features/app/all_crops/extra_works_zp/domain/useScanValueForExtraWorkHandler";
import { useScanZpOrTrayHandler } from "@/features/app/all_crops/extra_works_zp/domain/useScanZpOrTrayHandler";

export const useScannedValues = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isExtraWork230: boolean,
  isRoz = false,
  isHobbyTech = false,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned } = useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { scanFieldWhenIsForcedToScanFieldForZP, scanField } =
    useScanValueForExtraWorkHandler();
  const { scanZpOrTrayHandler } = useScanZpOrTrayHandler();
  const { checkIsScannedDataCorrect } =
    useGuard_CheckDataToBeScanned_ReturnFunction();

  /** state */
  //scanner
  const [qrLock, setQrLock] = useState(true);
  const [isFieldScanned, setIsFieldScanned] = useState(false);
  const [isZPScanned, setIsZPScanned] = useState(false);
  //scannedValues
  const { scannedValues, setScannedValues } = useScannedValuesForExtraWorks(
    isFieldScanned,
    setIsFieldScanned,
    isZPScanned,
    setIsZPScanned,
  );

  //force to scan field
  const [isForceToScanField, setIsForceToScanField] = useState(false);
  const [scannedZPOnManyFields, setScannedZPOnManyFields] = useState<
    ZpScannedValue[]
  >([]);

  const scanValueHandler = async (scannedValue: string, activityId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    /**
     * @public
     * @guard
     * Dostępne mozliwości:
     * gdy <b>isHobbyTech</b> dostepne: <b>ROZ</b>, <b>GRU</b>
     * gdy <b>isRoz</b> ale nie <b>isHobbyTech</b> dostepne: <b>ROZ</b>, <b>Lokalizacja</b>
     * gdy nie <b>isRoz</b> i nie <b>isHobbyTech</b> dostepne: <b>GRU</b>, <b>Lokalizacja</b>
     */
    const allowedValues: TypeOfScannedValue[] = [];
    if (isHobbyTech) allowedValues.push("zp_roz", "zp_gru");
    if (isRoz && !isHobbyTech) allowedValues.push("zp_roz", "field");
    if (!isRoz && !isHobbyTech) allowedValues.push("zp_gru", "field");
    const isScannedDataCorrect = checkIsScannedDataCorrect(
      scannedValue,
      allowedValues,
    );
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isZP = whatValueWasScanned === "zp_gru";
    const isField = whatValueWasScanned === "field";

    if (isField && isHobbyTech) {
      toast.warning(ERROR_MESSAGES.WHEN_HOBBY_TECH_ONLY_ZP_CAN_BE_SCANNED);
      return;
    }

    try {
      setIsLoading(true);

      //allowed paths/conditions
      if (!isField && (isZP || isRoz || whatValueWasScanned === "zp_roz")) {
        /**
         * @public
         * @reportItem
         * raport - gdy zeskanowany ZP:
         * @readFile `features/app/all_crops/extra_works_zp/domain/useScanZpOrTrayHandler.tsx`
         */
        await scanZpOrTrayHandler(
          {
            scannedValue,
            scannedValues,
            isZPScanned,
            setIsZPScanned,
            activityId,
            setScannedValues,
            setIsForceToScanField,
            setScannedZPOnManyFields,
          },
          isRoz || whatValueWasScanned === "zp_roz" ? "zp_roz" : "zp_gru",
          isHobbyTech,
        );

        return;
      }

      if (isField && isForceToScanField) {
        /**
         * @public
         * @reportItem
         * raport - gdy zeskanowana lokalizacja:
         * @readFile `features/app/all_crops/extra_works_zp/domain/useScanValueForExtraWorkHandler.tsx`
         */
        await scanFieldWhenIsForcedToScanFieldForZP(
          {
            scannedValue,
            scannedZPOnManyFields,
            setScannedValues,
            setScannedZPOnManyFields,
            setIsForceToScanField,
            setIsZPScanned,
          },
          false,
        );
        return;
      }

      if (isField && !isForceToScanField) {
        await scanField({
          scannedValue,
          isZPScanned,
          activityId,
          scannedValues,
          isFieldScanned,
          setScannedValues,
          setIsFieldScanned,
        });

        return;
      }

      throw new Error("scanValueHandler - condition not implemented.");
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  ////utils
  const clearScannedValues = () => {
    setScannedValues([]);
  };

  const deleteScannedValue = (value: string) => {
    toast.success(MESSAGES.ZP_DELETED_SUCCESS);
    setScannedValues((prevValues) =>
      prevValues.filter((v) => v.ordnmb !== value),
    );
  };

  const changePercentageOfScannedValue = (zpValue: ZpScannedValue) => {
    const zpValueName = zpValue.ordnmb;
    const correctedZpValues = scannedValues.map((item) => {
      if (item.ordnmb === zpValueName) {
        return { ...item, act_percentage: zpValue.act_percentage };
      }
      return item;
    });
    setScannedValues(correctedZpValues);
  };
  function clearZpOnManyFields() {
    setIsForceToScanField(false);
    setScannedZPOnManyFields([]);
  }

  ////return
  return {
    isFieldScanned,
    isZPScanned,
    isForceToScanField,
    scannedValues,
    scannedZPOnManyFields,
    qrLock,
    setQrLock,
    scanValueHandler,
    clearScannedValues,
    deleteScannedValue,
    changePercentageOfScannedValue,
    clearZpOnManyFields,
  };
};
