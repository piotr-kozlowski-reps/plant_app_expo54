import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import {
  ZPPackagingInfo,
  ZPPackagingInfoResponse,
} from "../types/interfaces-zp_packaging";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";
import { useErrorHandler } from "../utils/useErrorHandler";
import { useToastWrapper } from "../utils/useToastWrapper";

/**
 * @public
 * @reportItem
 * raport - informacje o ZP - konfekcjonowanie:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1761</b>&ordnmb=<b>%ordnmb%</b>
 */

export const useGetZPInfo_Packaging = () => {
  ////vars
  const { token } = useAuthSessionStore();
  const { toastWrapper } = useToastWrapper();
  const { errorHandler } = useErrorHandler();

  async function getZPInfo_Packaging(
    pureZp: string,
  ): Promise<ZPPackagingInfo | null> {
    try {
      const response =
        await query_getDataAsServerAction<ZPPackagingInfoResponse>(
          configPerBuild.apiAddress,
          `/api.php/REST/custom/korsolgetreport?rep_id=1761&ordnmb=${pureZp}`,
          token!,
        );

      /**
       * @public
       * @guard
       * Jesli zapytanie zwróciło pustą tablicę lub -1 ->  to koniec procedury i informacja, że nie zaleziono ZP na zakładzie.
       */
      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toastWrapper(
          `ZP o podanym ID (${pureZp}) nie został odnaleziony.`,
          "error",
        );
        return null;
      }

      const zpPackagingInfoDTO = response.data.resultMainQuery[0];

      const zpPackagingInfo: ZPPackagingInfo = {
        cid: Number.parseInt(zpPackagingInfoDTO.cid),
        prc_id: Number.parseInt(zpPackagingInfoDTO.prc_id),
        sordid: Number.parseInt(zpPackagingInfoDTO.sordid),
        ordnmb: zpPackagingInfoDTO.ordnmb,
        pcz_id: Number.parseInt(zpPackagingInfoDTO.pcz_id),
        ptc_kod: zpPackagingInfoDTO.ptc_kod,
        isdone: zpPackagingInfoDTO.isdone === "t" ? true : false,
      };

      return zpPackagingInfo;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getZPInfo_Packaging };
};
