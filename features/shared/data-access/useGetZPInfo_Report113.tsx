import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import { ZPDetailedInfo, ZPDetailedInfoResponse } from "../types/interfaces-zp";
import { getRepId113 } from "./getRepId113";

export const useGetZPInfo_Report113 = () => {
  async function getZPInfo_Report113(
    token: string,
    ZPWithoutAdditional_ZLEC: string,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<ZPDetailedInfo | null> {
    let response: ZPDetailedInfoResponse;
    try {
      response = await getRepId113<ZPDetailedInfoResponse>(
        configPerBuild.apiAddress,
        ZPWithoutAdditional_ZLEC,
        token
      );

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toast.error(
          `ZP o podanym ID (${ZPWithoutAdditional_ZLEC}) nie został odnaleziony.`
        );
        return null;
      }

      const zpDetailedInfoDTO = response.data.resultMainQuery[0];

      const zpDetailedInfo: ZPDetailedInfo = {
        isgarden: zpDetailedInfoDTO.isgarden,
        ordid_: Number.parseInt(zpDetailedInfoDTO.ordid_),
        ordnmb: zpDetailedInfoDTO.ordnmb,
        twrkod: zpDetailedInfoDTO.twrkod,
        twrnzw: zpDetailedInfoDTO.twrnzw,
        stkcnt: Number.parseInt(zpDetailedInfoDTO.stkcnt),
        allowmvplan: zpDetailedInfoDTO.allowmvplan === "t" ? true : false,
        tmpmvplan: zpDetailedInfoDTO.tmpmvplan
          ? new Date(zpDetailedInfoDTO.tmpmvplan.split(" ")[0])
          : null,
        outmvplan: zpDetailedInfoDTO.outmvplan
          ? new Date(zpDetailedInfoDTO.outmvplan.split(" ")[0])
          : null,
        tmsdat: zpDetailedInfoDTO.tmsdat
          ? new Date(zpDetailedInfoDTO.tmsdat.split(" ")[0])
          : null,
        dtlstm: zpDetailedInfoDTO.dtlstm
          ? new Date(zpDetailedInfoDTO.dtlstm.split(" ")[0])
          : null,
        prc_id: Number.parseInt(zpDetailedInfoDTO.prc_id),
        plndat: zpDetailedInfoDTO.plndat
          ? new Date(zpDetailedInfoDTO.plndat.split(" ")[0])
          : null,
        cutid_: zpDetailedInfoDTO.cutid_
          ? Number.parseInt(zpDetailedInfoDTO.cutid_)
          : null,
        outid_: zpDetailedInfoDTO.outid_
          ? Number.parseInt(zpDetailedInfoDTO.outid_)
          : null,
        outcnt: zpDetailedInfoDTO.outcnt
          ? Number.parseInt(zpDetailedInfoDTO.outcnt)
          : null,
        risecnt: zpDetailedInfoDTO.risecnt
          ? Number.parseInt(zpDetailedInfoDTO.risecnt)
          : null,
        wsk_palet: zpDetailedInfoDTO.wsk_palet
          ? Number.parseInt(zpDetailedInfoDTO.wsk_palet)
          : null,
        stk_id: zpDetailedInfoDTO.stk_id,
        stkid_: zpDetailedInfoDTO.stkid_
          ? Number.parseInt(zpDetailedInfoDTO.stkid_)
          : null,
      };

      return zpDetailedInfo;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getZPInfo_Rep113: getZPInfo_Report113 };
};
