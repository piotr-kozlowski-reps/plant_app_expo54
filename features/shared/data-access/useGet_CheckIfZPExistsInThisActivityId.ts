import { configPerBuild } from "../env/env";
import { TypeOfScannedValue } from "../types/interfaces-general";
import { ZPItem, ZPItemDTO, ZPItemResponse } from "../types/interfaces-zp";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";

export const useGet_CheckIfZPExistsInThisActivityId = () => {
  ////vars
  const { getPureZPValue, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();

  ////logic
  async function checkIfZPExistsInThisActivityId(
    value: string,
    token: string | null,
    activityId: number,
    whatWasScanned: TypeOfScannedValue,
  ): Promise<(ZPItem & { scanned_raw_value: string })[] | null> {
    let zpFoundValues: (ZPItem & { scanned_raw_value: string })[] | null = null;
    const queryDependingOnZpOrTray = getQueryDependingOnZpOrTray(
      value,
      activityId,
      whatWasScanned,
    );
    //fetch data
    let response: ZPItemResponse;
    const res = await fetch(queryDependingOnZpOrTray, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    response = (await res.json()) as ZPItemResponse;
    if (
      response.data.resultMainQuery === -1 ||
      response.data.resultMainQuery.length === 0
    ) {
      return null;
    }
    const arrayOfZpItemsDTO: ZPItemDTO[] = response.data.resultMainQuery;
    zpFoundValues = arrayOfZpItemsDTO.map((item) => ({
      scanned_raw_value: value,
      is_repeated: item.is_repeated === "t" ? true : false,
      activityid: item.activityid ? Number.parseInt(item.activityid) : null,
      planam: item.planam,
      ordnmb: item.ordnmb,
      prev_percentage: Number.parseInt(item.prev_percentage),
      stkcnt_loc: Number.parseInt(item.stkcnt_loc),
      stkcnt_ordnmb: Number.parseInt(item.stkcnt_ordnmb),
      act_percentage: Number.parseInt(item.act_percentage),
      sordid: Number.parseInt(item.sordid),
    }));
    return zpFoundValues;
  }

  function getQueryDependingOnZpOrTray(
    scannedValue: string,
    activityId: number,
    whatWasScanned: TypeOfScannedValue,
  ): string {
    if (whatWasScanned === "zp_gru" || whatWasScanned === "zp_roz") {
      const moduleKind = getModuleKind(whatWasScanned);

      return `${
        configPerBuild.apiAddress
      }/api.php/REST/custom/korsolgetreport?rep_id=${
        configPerBuild.edocReport_ZPForActivityId
      }&ordnmb=${getPureZPValue(
        scannedValue,
      )}&activityid=${activityId}&module=${moduleKind}`;
    }
    if (whatWasScanned === "tray") {
      return `${
        configPerBuild.apiAddress
      }/api.php/REST/custom/korsolgetreport?rep_id=${
        configPerBuild.edocReport_ZPForActivityId
      }&stk_id=${getPureTrayValue(
        scannedValue,
      )}&activityid=${activityId}&module=GRUNT`;
    }

    throw Error("getQueryDependingOnZpOrTray -> only zp and tray is handled");
  }

  function getModuleKind(whatWasScanned: TypeOfScannedValue) {
    if (whatWasScanned === "zp_gru") return "GRUNT";
    if (whatWasScanned === "zp_roz") return "SZKLO";

    throw Error("getModuleKind -> only zp and tray is handled");
  }

  return checkIfZPExistsInThisActivityId;
};
