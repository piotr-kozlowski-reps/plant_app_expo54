import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import { ZPFieldListDTO, ZPItem } from "@/features/shared/types/interfaces-zp";
import {
  TypeOfHobbyZp,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useGet_CheckIfZPExistsInThisActivityId } from "@/features/shared/data-access/useGet_CheckIfZPExistsInThisActivityId";
import { checkIfValueIsAlreadyScanned } from "./scanHelpers";
import { useGetListOfZPInDesiredField } from "@/features/shared/data-access/useGetListOfZPInDesiredField";

type DataForFieldWhenIsForcedToScanFieldForZP = {
  scannedValue: string;
  scannedZPOnManyFields: ZpScannedValue[];
  setScannedValues: (value: React.SetStateAction<ZpScannedValue[]>) => void;
  setScannedZPOnManyFields: (
    value: React.SetStateAction<ZpScannedValue[]>,
  ) => void;
  setIsForceToScanField: (value: React.SetStateAction<boolean>) => void;
  setIsZPScanned: (value: React.SetStateAction<boolean>) => void;
};

type DataForScanField = {
  scannedValue: string;
  isZPScanned: boolean;
  activityId: number;
  scannedValues: ZpScannedValue[];
  isFieldScanned: boolean;
  setScannedValues: React.Dispatch<React.SetStateAction<ZpScannedValue[]>>;
  setIsFieldScanned: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useScanValueForExtraWorkHandler = () => {
  //vars
  const { token } = useAuthSessionStore();
  const { getPureFieldValue } = useCheckWhatValueIsScannedHelpers();
  const { getListOfZPInDesiredField } = useGetListOfZPInDesiredField();

  async function scanFieldWhenIsForcedToScanFieldForZP(
    dataForScanField: DataForFieldWhenIsForcedToScanFieldForZP,
    isAddRestOfLocalizations: boolean,
    setRestOfLocalizations?: React.Dispatch<
      React.SetStateAction<RestOfLocalizationsDespiteOfOneChosen[]>
    >,
  ) {
    const {
      scannedValue,
      scannedZPOnManyFields,
      setScannedValues,
      setScannedZPOnManyFields,
      setIsForceToScanField,
      setIsZPScanned,
    } = dataForScanField;
    const scannedFieldNumber = getPureFieldValue(scannedValue);
    const foundFieldForDesiredZp = findFieldForDesiredZp(
      scannedFieldNumber,
      scannedZPOnManyFields,
    );
    if (!foundFieldForDesiredZp) {
      toast.warning(
        `Nie znaleziono ${
          scannedZPOnManyFields.length ? scannedZPOnManyFields[0].ordnmb : "ZP"
        } w lokalizacji: ${scannedFieldNumber}`,
      );
      return;
    }
    setScannedValues((prevValue) => [...prevValue, foundFieldForDesiredZp]);
    setScannedZPOnManyFields([]);
    setIsForceToScanField(false);
    setIsZPScanned(true);

    if (isAddRestOfLocalizations && !setRestOfLocalizations) {
      throw new Error(
        "setRestOfLocalizations is required when isAddRestOfLocalizations is true",
      );
    }
    if (isAddRestOfLocalizations && setRestOfLocalizations) {
      const localizationsNotInScannedField = scannedZPOnManyFields.filter(
        (item) => item.planam !== scannedFieldNumber,
      );
      const restOfLocalizations: RestOfLocalizationsDespiteOfOneChosen = {
        ordnmb: localizationsNotInScannedField[0].ordnmb,
        restOfLocalizations: localizationsNotInScannedField.map(
          (item) => item.planam,
        ),
      };
      setRestOfLocalizations((prevValue) => [
        ...prevValue,
        restOfLocalizations,
      ]);
    }
  }
  async function scanField(dataForScanField: DataForScanField) {
    const {
      isZPScanned,
      scannedValue,
      activityId,
      scannedValues,
      isFieldScanned,
      setScannedValues,
      setIsFieldScanned,
    } = dataForScanField;

    if (isZPScanned) {
      toast.warning(ERROR_MESSAGES.CANNOT_SCAN_FIELD_WHEN_ZP_SCANNED_EARLIER);
      return;
    }

    //check in API if ZP has any previous data for that activity
    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGetListOfZPInDesiredField.tsx`
     */
    const listOfZPs = await getListOfZPInDesiredField(
      scannedValue,
      token,
      activityId,
    );

    //check if any of ZPs have "/ROZ" in name - if so (rozsada szklarniowa) - user cannnt do anything
    const isRoz = listOfZPs.some((zp) => zp.ordnmb.endsWith("/ROZ"));
    if (isRoz) {
      toast.warning(ERROR_MESSAGES.CANNOT_SCAN_FIELD_WHEN_ROZ);
      return;
    }

    const listOfZPsThatHasNotBeenScannedYet: ZpScannedValue[] = [];
    listOfZPs.forEach((zp) => {
      const isValueAlreadyScanned = checkIfValueIsAlreadyScanned(
        zp.ordnmb,
        scannedValues,
      );
      if (isValueAlreadyScanned) {
        toast.warning(`ZPk: "${zp.ordnmb}" został już wcześniej zeskanowany.`);
      }
      if (!isValueAlreadyScanned) {
        listOfZPsThatHasNotBeenScannedYet.push(zp);
      }
    });
    setScannedValues((prevValue) => [
      ...prevValue,
      ...listOfZPsThatHasNotBeenScannedYet,
    ]);
    const isAtLeastOneZpInScannedField =
      listOfZPsThatHasNotBeenScannedYet.length;
    if (isAtLeastOneZpInScannedField) {
      if (!isFieldScanned) setIsFieldScanned(true);
    }
    if (!isAtLeastOneZpInScannedField) {
      if (isFieldScanned) setIsFieldScanned(false);
    }
  }

  return {
    // scanZpOrTrayHandler,
    scanFieldWhenIsForcedToScanFieldForZP,
    scanField,
  };

  //helpers
  function findFieldForDesiredZp(
    scannedFieldNumber: string,
    scannedZPOnManyFields: ZpScannedValue[],
  ): ZpScannedValue | null {
    const foundZPField = scannedZPOnManyFields.find(
      (zp) => zp.planam === scannedFieldNumber,
    );
    return foundZPField || null;
  }
};
