import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useState } from "react";
import { toast } from "sonner-native";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useScannedValuesForExtraWorks } from "@/features/shared/utils/useScannedValuesForExtraWorks";
import { useScanValueForExtraWorkHandler } from "./useScanValueForExtraWorkHandler";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";

export const useScannedValues = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isExtraWork230: boolean
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();
  const {
    scanZpOrTrayHandler,
    scanFieldWhenIsForcedToScanFieldForZP,
    scanField,
  } = useScanValueForExtraWorkHandler();

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
    setIsZPScanned
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

    // if (whatValueWasScanned === "unknown") {
    //   toast.warning(`Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`);
    //   return;
    // }
    // if (whatValueWasScanned === "tray") {
    //   toast.warning(ERROR_MESSAGES.MODULE_DOESNT_HANDLE_WITH_TRAY_QR);
    //   return;
    // }

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

      //allowed paths/conditions
      if (isZP) {
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
          "zp_gru"
        );

        return;
      }

      if (isField && isForceToScanField) {
        await scanFieldWhenIsForcedToScanFieldForZP(
          {
            scannedValue,
            scannedZPOnManyFields,
            setScannedValues,
            setScannedZPOnManyFields,
            setIsForceToScanField,
            setIsZPScanned,
          },
          false
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
      prevValues.filter((v) => v.ordnmb !== value)
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
