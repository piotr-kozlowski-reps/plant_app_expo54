import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";

import useAuthSessionStore from "../stores/useAuthSessionStore";
import { TrayForDon, TrayForDonResponse } from "../types/interfaces-tray";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "../utils/useErrorHandler";
import { getRepId1711 } from "./getRepId1711";

export const useGetTrayInfoForDon_Report1711 = () => {
  const { getPureTrayValue } = useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  /**
   * @public
   * @reportItem
   * raport - skan QR tacy i wywołanie raportu z informacjami o tacy dla roślin doniczkowych:
   * adres: /api.php/REST/custom/korsolgetreport?rep_id=<b>1711</b>&stk_id=<b>%stk_id%</b>
   */
  async function getTrayInfoForDon_Report1711(
    scannedValue: string,
  ): Promise<TrayForDon | null> {
    //vars
    const scannedStk_id = getPureTrayValue(scannedValue);
    let response: TrayForDonResponse;
    try {
      response = await getRepId1711<TrayForDonResponse>(
        configPerBuild.apiAddress,
        scannedStk_id,
        token!,
      );

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        const errorMessage = `Taca o podanym ID (${scannedStk_id}) nie została odnaleziona lub nie jest tacą typu: TN.`;
        toast.error(errorMessage, { id: errorMessage });
        return null;
      }

      const trayInfoForDonDTO = response.data.resultMainQuery[0];
      const trayInfo: TrayForDon = {
        id____: Number.parseInt(trayInfoForDonDTO.id____),
        stk_id: trayInfoForDonDTO.stk_id,
        ordnmb: trayInfoForDonDTO.ordnmb,
        stkprt: Number.parseInt(trayInfoForDonDTO.stkprt),
        stkdat: new Date(trayInfoForDonDTO.stkdat),
        bacdat: trayInfoForDonDTO.bacdat
          ? new Date(trayInfoForDonDTO.bacdat)
          : null,
        is_del: trayInfoForDonDTO.is_del === "t" ? true : false,
        event_dat: new Date(trayInfoForDonDTO.event_dat),
        event_type: trayInfoForDonDTO.event_type,
      };
      return trayInfo;
    } catch (error) {
      errorHandler(error as Error);
    }
    return null;
  }

  return { getTrayInfoForDon_Report1711 };
};
