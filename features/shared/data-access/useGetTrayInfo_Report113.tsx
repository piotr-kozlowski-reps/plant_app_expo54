import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import { getRepId113 } from "./getRepId113";
import { Tray, TrayResponse } from "../types/interfaces-tray";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";

export const useGetTrayInfo_Report113 = () => {
  const { getPureTrayValue } = useCheckWhatValueIsScannedHelpers();

  /**
   * @public
   * @reportItem
   * raport - skan QR tacy i wywołanie raportu:
   * adres: /api.php/REST/custom/korsolgetreport?rep_id=<b>113</b>&stk_id=<b>%stk_id%</b>&module=GRUNTstk_id=$<b>%stk_id%</b>&activityid=<b>%activityId%</b>&module=<b>GRUNT</b>`;
   */
  async function getTrayInfo_Rep113(
    token: string,
    scannedValue: string,
    errorHandler: (error: Error, errorTitle?: string) => void,
  ): Promise<Tray | null> {
    //vars

    const scannedStk_id = getPureTrayValue(scannedValue);

    let response: TrayResponse;
    try {
      response = await getRepId113<TrayResponse>(
        configPerBuild.apiAddress,
        scannedStk_id,
        token,
      );

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toast.error(
          `Taca o podanym ID (${scannedStk_id}) nie została odnaleziona.`,
        );
        return null;
      }

      const trayInfoDTO = response.data.resultMainQuery[0];

      const trayInfo: Tray = {
        sordid: Number.parseInt(trayInfoDTO.ordid_),
        ordnmb: trayInfoDTO.ordnmb,
        stk_id: trayInfoDTO.stk_id,
        lckcnt: Number.parseInt(trayInfoDTO.lckcnt),
        twrkod: trayInfoDTO.twrkod,
        twrnzw: trayInfoDTO.twrnzw,
        risecnt: Number.parseInt(trayInfoDTO.risecnt),
        allowmvplan: trayInfoDTO.allowmvplan === "t" ? true : false,
        tmpmvplan: trayInfoDTO.tmpmvplan
          ? new Date(trayInfoDTO.tmpmvplan.split(" ")[0])
          : null,
        stkcnt: Number.parseInt(trayInfoDTO.stkcnt),
        scanned_raw_value: scannedValue,
      };

      return trayInfo;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getTrayInfo_Rep113 };
};
