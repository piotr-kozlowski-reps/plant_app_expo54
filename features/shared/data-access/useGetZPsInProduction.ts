import useAuthSessionStore from "../stores/useAuthSessionStore";
import { useBaseAPI_URL_Store } from "../stores/useBaseAPI_URL_Store";
import { DTOReportReturnType } from "../types/interfaces-general";
import {
  ZpInProduction,
  ZpInProductionDTO,
} from "../types/interfaces-zps_in_production";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";
import { mapStringIntoInteger } from "./mapping_helpers";

export const useGetZPsInProduction = () => {
  const { baseURL } = useBaseAPI_URL_Store();
  const { user } = useAuthSessionStore();
  const token = user!.tokens.token;

  async function getZPsInProduction(): Promise<ZpInProduction[]> {
    console.log("getZPsInProduction");
    
    const data = await query_getDataAsServerAction<
      DTOReportReturnType<ZpInProductionDTO>
    >(baseURL, `/api.php/REST/custom/korsolgetreport?rep_id=1694`, token);

    console.log({ data });

    if (data.data.resultMainQuery === -1) {
      return [];
    }

    const dataMapped: ZpInProduction[] = data.data.resultMainQuery.map(
      (el) => ({
        ordnmb: el.ordnmb,
        sordid: mapStringIntoInteger(el.sordid),
        knt_akronim: el.knt_akronim,
        glowny: el.glowny,
      }),
    );

    console.log({ dataMapped });

    return dataMapped;
  }

  return getZPsInProduction;
};
