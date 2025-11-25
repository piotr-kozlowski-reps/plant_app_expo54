import { configPerBuild } from "../env/env";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import {
  TrayReplaceInfoRep88,
  TrayReplaceInfoRep88Response,
} from "../types/interfaces-replace_tray";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export const useGetTrayReplacementInfo_Report88 = () => {
  ////vars
  const { token } = useAuthSessionStore();

  async function getTrayReplacementInfo_Report88(
    stkold: string,
    stknew: string
  ): Promise<TrayReplaceInfoRep88 | null> {
    const query = `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_TrayReplacementInfo}&stkold='${stkold}'&stknew='${stknew}'&module=GRUNT`;

    const response =
      await query_getDataAsServerAction<TrayReplaceInfoRep88Response>(
        configPerBuild.apiAddress,
        query,
        token!
      );

    if (
      response.data.resultMainQuery === -1 ||
      response.data.resultMainQuery.length === 0
    ) {
      return null;
    }

    const trayReplaceInfoRep88: TrayReplaceInfoRep88 = {
      nstkid: Number.parseInt(response.data.resultMainQuery[0].nstkid),
      ostkid: response.data.resultMainQuery[0].ostkid,
    };

    return trayReplaceInfoRep88;
  }
  return { getTrayReplacementInfo_Report88 };
};
