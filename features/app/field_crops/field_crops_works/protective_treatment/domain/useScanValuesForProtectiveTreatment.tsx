import {
  ExtraWork,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import {
  ProtectiveTreatment,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import { useScannedValuesForExtraWorks } from "@/features/shared/utils/useScannedValuesForExtraWorks";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useScanValueForExtraWorkHandler } from "@/features/app/field_crops/extra_works_zp/domain/useScanValueForExtraWorkHandler";
import { MESSAGES } from "@/features/shared/utils/messages";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import { useGetLocalizationInfo_Report1580 } from "@/features/shared/data-access/useGetLocalizationInfo_Report1580";
import { useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587 } from "@/features/shared/data-access/useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587";
import { useRestOfLocalizationsHelpers } from "@/features/shared/utils/useRestOfLocalizationsHelpers";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";

export const useScanValuesForProtectiveTreatment = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { checkWhatValueWasScanned, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { errorHandler } = useErrorHandler();
  const {
    scanZpOrTrayHandler,
    scanFieldWhenIsForcedToScanFieldForZP,
    scanField,
  } = useScanValueForExtraWorkHandler();
  const { addRestOfLocalizationsWhenScannedFieldHandler } =
    useRestOfLocalizationsHelpers();

  /** state */
  //protective treatment data
  const [quantity, setQuantity] = useState<number | null>(null);
  const [treatment, setTreatment] = useState<ProtectiveTreatment | null>(null);
  const [extraWork, setExtraWork] = useState<ExtraWork | null>(null);
  const [who, setWho] = useState<WhoDidProtectiveTreatment | null>(null);
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
  //rest of localizations to show user when finished
  const [restOfLocalizations, setRestOfLocalizations] = useState<
    RestOfLocalizationsDespiteOfOneChosen[]
  >([]);
  const [
    isInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
  ] = useState(false);

  //fn
  const setDataForProtectiveTreatment = (
    quantity: number,
    treatment: ProtectiveTreatment,
    treatmentType: ExtraWork,
    who: WhoDidProtectiveTreatment
  ) => {
    setQuantity(quantity);
    setTreatment(treatment);
    setExtraWork(treatmentType);
    setWho(who);
  };
  const scanValueHandler = async (scannedValue: string, activityId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["tray", "field", "zp_gru"]
    );
    if (!isScannedDataCorrect) return;

    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    const isZP = whatValueWasScanned === "zp_gru";
    const isField = whatValueWasScanned === "field";
    const isTray = whatValueWasScanned === "tray";

    try {
      setIsLoading(true);

      //allowed conditions
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

      if (isTray) {
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
          "tray"
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
          true,
          setRestOfLocalizations
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

        forceChangeWhoDidProtectiveTreatmentToRobotWhenScannedField();
        await addRestOfLocalizationsWhenScannedFieldHandler(
          scannedValue,
          setRestOfLocalizations
        );

        return;
      }

      throw new Error("scanValueHandler - condition not implemented.");
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScannedValue = (value: string) => {
    toast.success(MESSAGES.ZP_DELETED_SUCCESS);
    setScannedValues((prevValues) =>
      prevValues.filter((v) => v.ordnmb !== value)
    );
  };

  const clearScannedValues = () => {
    setScannedValues([]);
  };

  function clearZpOnManyFields() {
    setIsForceToScanField(false);
    setScannedZPOnManyFields([]);
  }

  const resetInfoAboutRestOfLocalizations = () => {
    setRestOfLocalizations([]);
    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP(false);
  };

  /* hook return */
  return {
    quantity,
    treatment,
    extraWork,
    who,
    isForceToScanField,
    isFieldScanned,
    qrLock,
    scannedValues,
    isZPScanned,
    scannedZPOnManyFields,
    restOfLocalizations,
    isInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    setQrLock,
    setDataForProtectiveTreatment,
    scanValueHandler,
    deleteScannedValue,
    clearScannedValues,
    clearZpOnManyFields,
    resetInfoAboutRestOfLocalizations,
  };

  /**helpers */
  function forceChangeWhoDidProtectiveTreatmentToRobotWhenScannedField() {
    if (who !== "ROBOT") {
      setWho("ROBOT");
      toast.warning(
        MESSAGES.FORCE_CHANGE_WHO_DID_PROTECTIVE_TREATMENT_TO_ROBOT
      );
    }
  }

  // async function addRestOfLocalizationsWhenScannedFieldHandler(
  //   scannedValue: string
  // ) {
  //   const planam = getPureFieldValue(scannedValue);

  //   //fetch all desired info
  //   const ZPsPerLocalizationWithInfoAboutAllLocalizations =
  //     await getAllZPsInLocalizationWithAllLocalizationsInfo_Report1587(
  //       token!,
  //       planam,
  //       errorHandler
  //     );

  //   const ZPsWIthMoreThanOneLocalization =
  //     ZPsPerLocalizationWithInfoAboutAllLocalizations?.filter(
  //       (zp) => zp.localization.length > 1
  //     );

  //   if (ZPsWIthMoreThanOneLocalization?.length) {
  //     const ZPsWithRestOfLocalizations = ZPsWIthMoreThanOneLocalization.map(
  //       (item) => {
  //         const ordnmb = item.ordnmb;
  //         const restOfLocalizations = item.localization.filter(
  //           (loc) => loc.planam !== planam
  //         );
  //         return {
  //           ordnmb,
  //           restOfLocalizations: restOfLocalizations.map(
  //             (locInn) => locInn.planam
  //           ),
  //         };
  //       }
  //     );

  //     setRestOfLocalizations(ZPsWithRestOfLocalizations);
  //   }
  // }
};
