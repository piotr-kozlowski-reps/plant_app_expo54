import { configPerBuild } from "../env/env";
import useAuthSessionStore from "../stores/useAuthSessionStore";
import {
  ReportDamagedTrays,
  ReportDamagedTraysDTO,
  ReportDamagedTraysResponse,
} from "../types/interfaces-report_damaged_trays";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export const useGetReportDamagedTrays_Report92 = () => {
  ////vars
  const { token } = useAuthSessionStore();

  async function getReportDamagedTrays_Report92(
    dateAsString: string
  ): Promise<ReportDamagedTrays[] | null> {
    const response =
      await query_getDataAsServerAction<ReportDamagedTraysResponse>(
        configPerBuild.apiAddress,
        `/api.php/REST/custom/korsolgetreport?rep_id=92&filter_string=date(dstdat)='${dateAsString}'`,
        token!
      );

    if (
      response.data.resultMainQuery === -1 ||
      response.data.resultMainQuery.length === 0
    ) {
      return [];
    }

    const reportDataDTO: ReportDamagedTraysDTO[] =
      response.data.resultMainQuery;
    const reportData: ReportDamagedTrays[] = reportDataDTO.map((item) => ({
      stk_id: item.stk_id,
      dstdat: item.dstdat,
      usrnam: item.usrnam,
      dstuid: Number.parseInt(item.dstuid),
    }));

    return reportData;
  }
  return { getReportDamagedTrays_Report92 };
};
