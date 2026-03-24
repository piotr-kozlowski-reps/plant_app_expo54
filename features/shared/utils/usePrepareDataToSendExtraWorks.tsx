import {
  ExtraWork,
  Post_ExtraWork_ZP_DTO,
  ZpScannedValue,
  ZpScannedValueToBeSent,
} from "../types/interfaces-extra_works";
import { ZpToNitrogenIrrigation } from "../types/interfaces-nitrogen_irrigation";
import { ProtectiveTreatment } from "../types/interfaces-protective_treatment";
import {
  getIsHobbyExtraWorkWithTj10,
  getIsHobbyExtraWorkWithTj12,
} from "./hobbyExtraWorksHelpers";
import { useCheckWhatValueIsScannedHelpers } from "./useCheckWhatValueIsScannedHelpers";

export const usePrepareDataToSendExtraWorks = () => {
  ////vars
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();

  /**fn */
  const prepareDataToSendExtraWorksHandler = (
    extraWork: ExtraWork,
    begin_date: Date,
    scannedValues: ZpScannedValue[],
    selectedProtectiveTreatment: ProtectiveTreatment | null,
    zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[],
    tjCount: number | null | undefined,
  ) => {
    const dataToBeSent: Post_ExtraWork_ZP_DTO = {
      activityid: extraWork.keyval,
      // begindat: begin_date,
      scanned_raw_value: scannedValues[0].scanned_raw_value,
      donedat: new Date(Date.now()),
      mobile: true,
      // tj12Count: tj12Count ? tj12Count : null,
      ordnmb_json: prepareScannedValuesToBeSent(
        scannedValues,
        selectedProtectiveTreatment,
        zpListWithOrderedNitrogenIrrigation,
      ),
    };

    //hobby extra works addition
    const isActivityIdHobbyWithTj10 = getIsHobbyExtraWorkWithTj10(extraWork);
    const isActivityIdHobbyWithTj12 = getIsHobbyExtraWorkWithTj12(extraWork);
    if (isActivityIdHobbyWithTj12 && tjCount) dataToBeSent.tj12Count = tjCount;
    if (isActivityIdHobbyWithTj10 && tjCount) dataToBeSent.tj10Count = tjCount;

    return dataToBeSent;
  };

  //hook return
  return { prepareDataToSendExtraWorksHandler };

  /**helpers */
  function prepareScannedValuesToBeSent(
    scannedValues: ZpScannedValue[],
    selectedProtectiveTreatment: ProtectiveTreatment | null,
    zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[],
  ): ZpScannedValueToBeSent[] {
    let scannedValuesPreparedToBeSent: ZpScannedValueToBeSent[] = [];
    scannedValuesPreparedToBeSent = pickOnlyDesiredValuesToBeSent(
      scannedValues,
      selectedProtectiveTreatment,
      zpListWithOrderedNitrogenIrrigation,
    );

    scannedValuesPreparedToBeSent = cutPrefixZlecInStrings(
      scannedValuesPreparedToBeSent,
    );

    return scannedValuesPreparedToBeSent;
  }

  function pickOnlyDesiredValuesToBeSent(
    scannedValues: ZpScannedValue[],
    selectedProtectiveTreatment: ProtectiveTreatment | null,
    zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[],
  ): ZpScannedValueToBeSent[] {
    const pickedOnlyDesiredValuesToBeSent: ZpScannedValueToBeSent[] =
      scannedValues.map((item) => ({
        scanned_raw_value: item.scanned_raw_value,
        ordnmb: item.ordnmb,
        planam: item.planam,
        act_percentage: item.act_percentage,
        prev_percentage: item.prev_percentage,
        stkcnt_loc: item.stkcnt_loc,
        stkcnt_ordnmb: item.stkcnt_ordnmb,
        treatid: selectedProtectiveTreatment
          ? selectedProtectiveTreatment.id____
          : null,
        dscrpt: selectedProtectiveTreatment
          ? selectedProtectiveTreatment.dscrpt
          : null,
        plan_id: getPlanIdIfPossible(
          zpListWithOrderedNitrogenIrrigation,
          item.ordnmb,
        ),
      }));

    return pickedOnlyDesiredValuesToBeSent;
  }

  function getPlanIdIfPossible(
    zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[],
    ordnmb: string,
  ): null | number {
    if (
      zpListWithOrderedNitrogenIrrigation &&
      zpListWithOrderedNitrogenIrrigation.length
    ) {
      const foundZp = zpListWithOrderedNitrogenIrrigation.find(
        (zp) => zp.ordnmb === ordnmb,
      );

      if (foundZp) {
        return foundZp.plan_id;
      }
    }
    return null;
  }

  function cutPrefixZlecInStrings(
    stringsArray: ZpScannedValueToBeSent[],
  ): ZpScannedValueToBeSent[] {
    return stringsArray.map((value) => ({
      ...value,
      ordnmb: getPureZPValue(value.ordnmb),
    }));
  }
};
