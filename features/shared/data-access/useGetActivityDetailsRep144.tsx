import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import {
  ZpRozActivityDetails,
  ZpRozActivityDetailsResponse,
} from "../types/interfaces-activities_list";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export const useGetActivityDetailsRep144 = () => {
  //vars
  const { token } = useAuthSessionStore();

  async function getActivityDetails_Report144(
    pcz_id: number,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<ZpRozActivityDetails[] | null> {
    let response: ZpRozActivityDetailsResponse;

    try {
      response =
        await query_getDataAsServerAction<ZpRozActivityDetailsResponse>(
          configPerBuild.apiAddress,
          `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ActivityDetails}&pcz_id=${pcz_id}`,
          token!
        );

      if (!response.data.resultMainQuery) {
        toast.error(`Brak informacji o czynności dla id (${pcz_id}).`);
        return [];
      }

      if (response.data.resultMainQuery === -1) {
        return [];
      }

      //map DTO into object
      const zpRozActivityDetailsDTO = response.data.resultMainQuery;
      const zpRozActivityDetails: ZpRozActivityDetails[] =
        zpRozActivityDetailsDTO.map((item) => ({
          id: Number.parseInt(item.id),
          dscrpt: item.dscrpt,
          ilebeg: Number.parseInt(item.ilebeg),
          iledne: Number.parseInt(item.iledne),
          status: Number.parseInt(item.status),
        }));

      return zpRozActivityDetails;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getActivityDetails_Report144 };
};
