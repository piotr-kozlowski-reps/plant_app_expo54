import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import { ZpScannedValue } from "../types/interfaces-extra_works";
import { ZPFieldListDTO } from "../types/interfaces-zp";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";

export const useGetListOfZPInDesiredField = () => {
  ////vars
  const { getPureFieldValue } = useCheckWhatValueIsScannedHelpers();

  /**
   * @public
   * @reportItem
   * @order 30
   * raport: lista ZPków w danej lokalizacji:
   * adres: <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1569</b>&planam=$<b>%planam%</b>&activityid=<b>%activityId%</b>
   */
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
      const errorMessage = `Brak ZPków w lokalizacji: "${value}".`;
      toast.error(errorMessage, { id: errorMessage });
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
        trace_type: item.trace_type,
      };
    });

    return listOfZPsOnField;
  }

  ////hook return
  return {
    getListOfZPInDesiredField,
  };
};
