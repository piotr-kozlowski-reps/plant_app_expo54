import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import {
  ZpRozActivity,
  ZpRozActivityResponse,
} from "../types/interfaces-activities_list";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export const useGetActivitiesListRep143 = () => {
  //vars
  const { token } = useAuthSessionStore();

  async function getActivitiesList_Report143(
    ordnmb: string,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<ZpRozActivity[] | null> {
    let response: ZpRozActivityResponse;

    try {
      response = await query_getDataAsServerAction<ZpRozActivityResponse>(
        configPerBuild.apiAddress,
        `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ActivitiesList}&ordnmb=${ordnmb}`,
        token!
      );

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toast.error(
          `Brak informacji o czynnościach na zeskanowanym ZPku (${ordnmb}).`
        );
        return null;
      }

      //map DTO into object
      const zpRozActivitiesDTO = response.data.resultMainQuery;
      const zpRozActivities: ZpRozActivity[] = zpRozActivitiesDTO.map((zp) => ({
        is_active: zp.is_active === "t" ? true : false,
        enabled1: zp.enabled1 === "t" ? true : false,
        id: Number.parseInt(zp.id),
        pcz_id: Number.parseInt(zp.pcz_id),
        dscrpt: zp.dscrpt,
        ilebeg: Number.parseInt(zp.ilebeg),
        iledne: Number.parseInt(zp.iledne),
        status: zp.status ? Number.parseInt(zp.status) : null,
        pcz_pzlid: Number.parseInt(zp.pcz_pzlid),
        prior: Number.parseInt(zp.prior),
        enabled: zp.enabled === "t" ? true : false,
      }));

      return zpRozActivities;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getActivitiesList_Report143 };
};
