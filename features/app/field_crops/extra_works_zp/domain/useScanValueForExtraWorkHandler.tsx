import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import {
  ZPFieldListDTO,
  ZPItem,
  ZPItemDTO,
  ZPItemResponse,
} from "@/features/shared/types/interfaces-zp";
import {
  TypeOfHobbyZp,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { toast } from "sonner-native";
import { useGet_CheckIfZPExistsInThisActivityId } from "@/features/shared/data-access/useGet_CheckIfZPExistsInThisActivityId";

type DataForScanZP = {
  scannedValue: string;
  scannedValues: ZpScannedValue[];
  isZPScanned: boolean;
  setIsZPScanned: React.Dispatch<React.SetStateAction<boolean>>;
  activityId: number;
  setScannedValues: React.Dispatch<React.SetStateAction<ZpScannedValue[]>>;
  setIsForceToScanField: (value: React.SetStateAction<boolean>) => void;
  setScannedZPOnManyFields: (
    value: React.SetStateAction<ZpScannedValue[]>,
  ) => void;
};
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
  const { getPureZPValue, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const checkIfZPExistsInThisActivityId =
    useGet_CheckIfZPExistsInThisActivityId();

  //zp

  async function scanZpOrTrayHandler(
    dataForScanZP: DataForScanZP,
    whatWasScanned: TypeOfScannedValue,
    isHobbyTech?: boolean,
  ) {
    const {
      scannedValue,
      scannedValues,
      isZPScanned,
      setIsZPScanned,
      activityId,
      setScannedValues,
      setIsForceToScanField,
      setScannedZPOnManyFields,
    } = dataForScanZP;

    console.log("scanZpOrTrayHandler");

    if (
      whatWasScanned !== "tray" &&
      whatWasScanned !== "zp_gru" &&
      whatWasScanned !== "zp_roz"
    ) {
      toast.warning(
        ERROR_MESSAGES.WRONG_PARAMETER +
          "-> " +
          whatWasScanned +
          " -> scanZpOrTrayHandler",
      );
      return;
    }

    //check in API if ZP has any previous data for that activity
    const ZPFoundForThisActivityId:
      | (ZPItem & { scanned_raw_value: string })[]
      | null = await checkIfZPExistsInThisActivityId(
      scannedValue,
      token,
      activityId,
      whatWasScanned,
    );

    //is ZP already scanned
    const zpOrdnmb =
      ZPFoundForThisActivityId && ZPFoundForThisActivityId.length
        ? ZPFoundForThisActivityId[0].ordnmb
        : null;
    if (checkIfValueIsAlreadyScanned(zpOrdnmb, scannedValues)) {
      toast.warning(ERROR_MESSAGES.ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST);
      return;
    }

    //guard:
    //for hobby need to check if zp is hobby and if has proper tj trays (tj10 or tj12)
    if (isHobbyTech) {
      const ordnmb = getPureZPValue(scannedValue);
      const whatKindOfHobbyZp = await checkIfIsHobbyZp(ordnmb, token);

      if (whatKindOfHobbyZp === "no_hobby" || !whatKindOfHobbyZp) {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_IS_NOT_HOBBY_ZP);
        return;
      }

      if (activityId === 30667241 && whatKindOfHobbyZp === "hobby_tj10") {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_HAS_TJ10_TRAYS);
        return;
      }
      if (activityId === 773246 && whatKindOfHobbyZp === "hobby_tj12") {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_HAS_TJ12_TRAYS);
        return;
      }
    }

    if (!isZPScanned) setIsZPScanned(true);

    //conditions
    const valueNotFound =
      !ZPFoundForThisActivityId ||
      (ZPFoundForThisActivityId && ZPFoundForThisActivityId.length === 0);
    const foundZPOnlyInOneLocalization =
      ZPFoundForThisActivityId && ZPFoundForThisActivityId.length === 1;

    if (valueNotFound) {
      const ZPWIthoutPrefixZLEC_ = getPureZPValue(scannedValue);
      toast.warning(
        `ZPk: "${ZPWIthoutPrefixZLEC_}" nie został znaleziony na obiekcie.`,
      );
      setScannedValues((prevValues) => [
        ...prevValues,
        {
          scanned_raw_value: scannedValue,
          planam: "BRAK",
          ordnmb: ZPWIthoutPrefixZLEC_,
          act_percentage: 100,
          prev_percentage: 0,
          stkcnt_loc: 0,
          stkcnt_ordnmb: 0,
          sordid: null,
        },
      ]);
    }

    if (foundZPOnlyInOneLocalization) {
      setScannedValues((prevValues) => [
        ...prevValues,
        {
          scanned_raw_value: scannedValue,
          planam: ZPFoundForThisActivityId[0].planam,
          ordnmb: ZPFoundForThisActivityId[0].ordnmb,
          act_percentage: ZPFoundForThisActivityId[0].act_percentage,
          prev_percentage: ZPFoundForThisActivityId[0].prev_percentage,
          stkcnt_loc: ZPFoundForThisActivityId[0].stkcnt_loc,
          stkcnt_ordnmb: ZPFoundForThisActivityId[0].stkcnt_ordnmb,
          sordid: ZPFoundForThisActivityId[0].sordid,
        },
      ]);
    }

    if (ZPFoundForThisActivityId && ZPFoundForThisActivityId.length > 1) {
      setIsForceToScanField(true);
      setScannedZPOnManyFields(ZPFoundForThisActivityId);
    }
  }
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
    scanZpOrTrayHandler,
    scanFieldWhenIsForcedToScanFieldForZP,
    scanField,
  };

  //helpers
  async function getListOfZPInDesiredField(
    value: string,
    token: string | null,
    activityId: number,
  ): Promise<ZpScannedValue[]> {
    let listOfZPsOnField: ZpScannedValue[] = [];

    //fetch data
    const fieldNumber = getPureFieldValue(value);
    const res = await fetch(
      `${configPerBuild.apiAddress}/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ListOfZPsFromAField}&planam=${fieldNumber}&activityid=${activityId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const response: ZPFieldListDTO = (await res.json()) as ZPFieldListDTO;

    if (response.data.resultMainQuery === -1) {
      toast.error(`Brak ZPków w lokalizacji: "${value}".`);
      return listOfZPsOnField;
    }

    listOfZPsOnField = response.data.resultMainQuery.map((item) => {
      return {
        scanned_raw_value: value,
        planam: item.planam ? item.planam : "BRAK",
        ordnmb: item.ordnmb,
        prev_percentage: Number.parseInt(item.prev_percentage),
        act_percentage: Number.parseInt(item.act_percentage),
        stkcnt_loc: Number.parseInt(item.stkcnt_loc),
        stkcnt_ordnmb: Number.parseInt(item.stkcnt_ordnmb),
        sordid: Number.parseInt(item.sordid),
      };
    });

    return listOfZPsOnField;
  }
  function checkIfValueIsAlreadyScanned(
    zpValue: string | null,
    scannedValuesArray: ZpScannedValue[],
  ): boolean {
    if (!zpValue) return false;

    const scannedZpValues: string[] = scannedValuesArray.map(
      (item) => item.ordnmb,
    );
    return scannedZpValues.includes(zpValue);
  }
  // async function checkIfZPExistsInThisActivityId(
  //   value: string,
  //   token: string | null,
  //   activityId: number,
  //   whatWasScanned: TypeOfScannedValue
  // ): Promise<(ZPItem & { scanned_raw_value: string })[] | null> {
  //   let zpFoundValues: (ZPItem & { scanned_raw_value: string })[] | null = null;

  //   const queryDependingOnZpOrTray = getQueryDependingOnZpOrTray(
  //     value,
  //     activityId,
  //     whatWasScanned
  //   );

  //   //fetch data
  //   let response: ZPItemResponse;
  //   const res = await fetch(queryDependingOnZpOrTray, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   response = (await res.json()) as ZPItemResponse;

  //   if (
  //     response.data.resultMainQuery === -1 ||
  //     response.data.resultMainQuery.length === 0
  //   ) {
  //     return null;
  //   }

  //   const arrayOfZpItemsDTO: ZPItemDTO[] = response.data.resultMainQuery;

  //   zpFoundValues = arrayOfZpItemsDTO.map((item) => ({
  //     scanned_raw_value: value,
  //     is_repeated: item.is_repeated === "t" ? true : false,
  //     activityid: item.activityid ? Number.parseInt(item.activityid) : null,
  //     planam: item.planam,
  //     ordnmb: item.ordnmb,
  //     prev_percentage: Number.parseInt(item.prev_percentage),
  //     stkcnt_loc: Number.parseInt(item.stkcnt_loc),
  //     stkcnt_ordnmb: Number.parseInt(item.stkcnt_ordnmb),
  //     act_percentage: Number.parseInt(item.act_percentage),
  //     sordid: Number.parseInt(item.sordid),
  //   }));

  //   return zpFoundValues;
  // }
  // function getQueryDependingOnZpOrTray(
  //   scannedValue: string,
  //   activityId: number,
  //   whatWasScanned: TypeOfScannedValue
  // ): string {
  //   if (whatWasScanned === "zp_gru" || whatWasScanned === "zp_roz") {
  //     const moduleKind = getModuleKind(whatWasScanned);

  //     return `${
  //       configPerBuild.apiAddress
  //     }/api.php/REST/custom/korsolgetreport?rep_id=${
  //       configPerBuild.edocReport_ZPForActivityId
  //     }&ordnmb=${getPureZPValue(
  //       scannedValue
  //     )}&activityid=${activityId}&module=${moduleKind}`;
  //   }
  //   if (whatWasScanned === "tray") {
  //     return `${
  //       configPerBuild.apiAddress
  //     }/api.php/REST/custom/korsolgetreport?rep_id=${
  //       configPerBuild.edocReport_ZPForActivityId
  //     }&stk_id=${getPureTrayValue(
  //       scannedValue
  //     )}&activityid=${activityId}&module=GRUNT`;
  //   }

  //   throw Error("getQueryDependingOnZpOrTray -> only zp and tray is handled");
  // }
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

async function checkIfIsHobbyZp(
  ordnmb: string,
  token: string | null,
): Promise<TypeOfHobbyZp | null> {
  const res = await fetch(
    `${configPerBuild.apiAddress}/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZpNameData}&ordnmb=${ordnmb}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const response = await res.json();

  if (response.data.resultMainQuery === -1) {
    return null;
  }
  const zpName: string = response.data.resultMainQuery[0].twr_kod;
  if (!zpName) return null;
  if (!zpName.startsWith("HOB")) return "no_hobby";
  if (zpName.startsWith("HOB") && zpName.endsWith("TJ12")) return "hobby_tj12";
  if (zpName.startsWith("HOB") && zpName.endsWith("TJ10")) return "hobby_tj10";

  return null;
}

// function getModuleKind(whatWasScanned: TypeOfScannedValue) {
//   if (whatWasScanned === "zp_gru") return "GRUNT";
//   if (whatWasScanned === "zp_roz") return "SZKLO";

//   throw Error("getModuleKind -> only zp and tray is handled");
// }
