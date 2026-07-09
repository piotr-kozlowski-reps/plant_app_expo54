import {
  TypeOfHobbyZp,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { ZPItem } from "@/features/shared/types/interfaces-zp";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useGet_CheckIfZPExistsInThisActivityId } from "@/features/shared/data-access/useGet_CheckIfZPExistsInThisActivityId";
import { checkIfValueIsAlreadyScanned } from "./scanHelpers";
import {
  getIsHobbyExtraTechWorkPackingWithTj10,
  getIsHobbyExtraTechWorkPackingWithTj12,
  getIsHobbyExtraWorkWithTj10,
  getIsHobbyExtraWorkWithTj12,
} from "@/features/shared/utils/hobbyExtraWorksHelpers";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { configPerBuild } from "@/features/shared/env/env";

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

export const useScanZpOrTrayHandler = () => {
  ////vars
  const { token } = useAuthSessionStore();
  const checkIfZPExistsInThisActivityId =
    useGet_CheckIfZPExistsInThisActivityId();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();

  ////fn
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

    if (
      whatWasScanned !== "tray" &&
      whatWasScanned !== "zp_gru" &&
      whatWasScanned !== "zp_roz" &&
      whatWasScanned !== "zp_don"
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
    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGet_CheckIfZPExistsInThisActivityId.ts`
     */

    const ZPFoundForThisActivityId:
      | (ZPItem & { scanned_raw_value: string })[]
      | null = await checkIfZPExistsInThisActivityId(
      scannedValue,
      token,
      activityId,
      whatWasScanned,
    );

    console.log({
      ZPFoundForThisActivityId,
    });

    /**
     * @public
     * @guard
     * Jeżeli ZP'ek był już wcześniej zeskanowany i jest na liście -> koniec procedury.
     */
    const zpOrdnmb =
      ZPFoundForThisActivityId && ZPFoundForThisActivityId.length
        ? ZPFoundForThisActivityId[0].ordnmb
        : null;
    if (checkIfValueIsAlreadyScanned(zpOrdnmb, scannedValues)) {
      toast.warning(ERROR_MESSAGES.ZP_WAS_ALREADY_SCANNED_AND_IS_ON_LIST);
      return;
    }

    /**
     * @public
     * @guard
     * Zabezpieczenie dodatkowe - wyłączone
     * Kornel zdecydował, jakby mnie pytal i chcial sie tego potem wyprzec :)
     * gdy nie znaleziono ZP na obiekcie, to koniec procedury
     */
    if (!ZPFoundForThisActivityId || ZPFoundForThisActivityId.length === 0) {
      toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
      return;
    }

    /**
     * @public
     * @guard
     * Globalne zabezpieczenie dla PracExtra - sprawdzanie czy ZP był już wykonany i jaka jest wartość is_repeated -> tak aby użytkownik nie mógł zeskanować tego samego ZPka 2 razy
     * jeżeli: activityid=null - może wszystko
     * jeżeli: activityid=value && is_repeated = true - może wykonać pracę raz jeszcze
     * jeżeli: activityid=value && is_repeated = false - NIE MOŻE wykonać pracy raz jeszcze
     */
    if (!checkIfExtraWorkCanBeRepeated(ZPFoundForThisActivityId)) {
      toast.warning(ERROR_MESSAGES.THIS_EXTRA_WORK_CANNOT_BE_REPEATED, {
        id: ERROR_MESSAGES.THIS_EXTRA_WORK_CANNOT_BE_REPEATED,
      });
      return;
    }

    /**
     * @public
     * @guard
     * Dla hobbytech praca: "pikowanie gru hobby 10 i 12" - weryfikacja czy ZP jest ZP'kiem hobby i czy ma odpowiednie tace TJ -> TJ10 czt TJ12
     */
    const isActivityIdHobbyWithTj10 = getIsHobbyExtraWorkWithTj10(activityId);
    const isActivityIdHobbyWithTj12 = getIsHobbyExtraWorkWithTj12(activityId);

    /**
     * @public
     * @guard
     * Dla hobbytech praca: "konfekcjonowanie gru hobby ecc 10 i ecc 12" - weryfikacja czy ZP jest ZP'kiem hobby i czy ma odpowiednie tace TJ -> TJ10 czt TJ12
     * W tym przypadku operator ma mieć możliwość potwierdzenia operacji tylko jeżeli w materiałach danego ZP znajduje się TJT.ECC i TJ12" - to Kornel na razie kazal olac
     *  zapytanie adres: <b>{{URL}}</b>api.php/REST/custom/korsolgetreport?rep_id=<b>1703</b>&ordnmb=<b>%ordnmb%</b>`,
     */

    const isActivityIdHobbyWithTj12AndPackaging =
      getIsHobbyExtraTechWorkPackingWithTj12(activityId);
    const isActivityIdHobbyWithTj10AndPackaging =
      getIsHobbyExtraTechWorkPackingWithTj10(activityId);

    if (isHobbyTech) {
      const ordnmb = getPureZPValue(scannedValue);
      const whatKindOfHobbyZp = await checkIfIsHobbyZp(ordnmb, token);

      if (whatKindOfHobbyZp === "no_hobby" || !whatKindOfHobbyZp) {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_IS_NOT_HOBBY_ZP);
        return;
      }

      if (
        (isActivityIdHobbyWithTj12 || isActivityIdHobbyWithTj12AndPackaging) &&
        whatKindOfHobbyZp === "hobby_tj10"
      ) {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_HAS_TJ10_TRAYS);
        return;
      }
      if (
        (isActivityIdHobbyWithTj10 || isActivityIdHobbyWithTj10AndPackaging) &&
        whatKindOfHobbyZp === "hobby_tj12"
      ) {
        toast.warning(ERROR_MESSAGES.SCANNED_ZP_HAS_TJ12_TRAYS);
        return;
      }

      /**
       * @public
       * @guard
       * Jeżeli dana aktywność wymaga TJ10 lub TJ12 a ZPek nie ma ich określonych. (przykłady HobbyROZ, które nie mają TJotów określonych)
       * Info dla użytkownika i koniec procedury
       */
      const isActivityThatNeedsTj10OrTj12 =
        isActivityIdHobbyWithTj12 ||
        isActivityIdHobbyWithTj10 ||
        isActivityIdHobbyWithTj12AndPackaging ||
        isActivityIdHobbyWithTj10AndPackaging;
      if (isActivityThatNeedsTj10OrTj12 && whatKindOfHobbyZp === "hobby_rest") {
        toast.warning(
          ERROR_MESSAGES.SCANNED_ZP_HAS_NO_TJ_TRAYS_AND_THEY_ARE_NECESSARY,
        );
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
        `ZP'k: "${ZPWIthoutPrefixZLEC_}" nie został znaleziony na obiekcie.`,
      );
      setScannedValues((prevValues) => {
        const foundZPInPrevScannedValues = prevValues.find(
          (prev) => prev.ordnmb === ZPWIthoutPrefixZLEC_,
        );

        if (!foundZPInPrevScannedValues) {
          return [
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
              trace_type: "",
            },
          ];
        }

        return prevValues;
      });
    }

    if (foundZPOnlyInOneLocalization) {
      setScannedValues((prevValues) => {
        const foundZPInPrevScannedValues = prevValues.find(
          (prev) => prev.ordnmb === ZPFoundForThisActivityId[0].ordnmb,
        );

        if (!foundZPInPrevScannedValues) {
          return [
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
              trace_type: ZPFoundForThisActivityId[0].trace_type,
            },
          ];
        }

        return prevValues;
      });
    }

    /**
     * @public
     * @guard
     * Dla hobbyTech - nie bieżemy w ogóle możliwości zeskanowania całej lokalizacji, tylko zawsze cały ZPek
     */
    // when hobby tech - we shouldn't consider localizations, always take whole ZP, here I fake it with first loc from array, but later, when I send it to backend, API takes whole ZP
    if (
      ZPFoundForThisActivityId &&
      ZPFoundForThisActivityId.length > 1 &&
      !isHobbyTech
    ) {
      setIsForceToScanField(true);
      setScannedZPOnManyFields(ZPFoundForThisActivityId);
    }

    if (
      ZPFoundForThisActivityId &&
      ZPFoundForThisActivityId.length > 1 &&
      isHobbyTech
    ) {
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
          trace_type: ZPFoundForThisActivityId[0].trace_type,
        },
      ]);
    }
  }

  return { scanZpOrTrayHandler };
};

////helpers
function checkIfExtraWorkCanBeRepeated(
  ZPFoundForThisActivityId: ZPItem[] | null,
): boolean {
  if (!ZPFoundForThisActivityId || ZPFoundForThisActivityId.length === 0)
    return false;

  const isRepeated = ZPFoundForThisActivityId[0].is_repeated;
  const activityId = ZPFoundForThisActivityId[0].activityid;

  if (isRepeated) return true;
  if (!isRepeated && activityId) return false;
  if (!isRepeated && !activityId) return true;
  return false;
}

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
  if (zpName.startsWith("HOB")) return "hobby_rest";

  return null;
}
