import { configPerBuild } from "../env/env";
import {
  ControlSowingChanges,
  ControlSowingChangesDTO,
  ControlSowingChangesResponse,
} from "../types/interface-control_sowing_changes";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export const useGetControlSowingChanges_Report119 = () => {
  async function getControlSowingChanges_Report119(
    token: string,
    stkida: string,
    stkidb: string,
    ordnmb: string,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<ControlSowingChanges | null> {
    const response =
      await query_getDataAsServerAction<ControlSowingChangesResponse>(
        configPerBuild.apiAddress,
        `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ControlSowingChanges}&stkida=${stkida}&stkidb=${stkidb}&ordnmb=${ordnmb}&module=GRUNT`,
        token!
      );

    if (
      response.data.resultMainQuery === -1 ||
      response.data.resultMainQuery.length === 0
    ) {
      return null;
    }

    const reportDataDTO: ControlSowingChangesDTO =
      response.data.resultMainQuery[0];
    const reportData: ControlSowingChanges = {
      errtxt: reportDataDTO.errtxt,
      stkid1: reportDataDTO.stkid1,
      ordid1: reportDataDTO.ordid1 ? reportDataDTO.ordid1 : null,
      ordnmb1: reportDataDTO.ordnmb1,
      movid1: reportDataDTO.movid1
        ? Number.parseInt(reportDataDTO.movid1)
        : null,
    };

    return reportData;
  }
  return { getControlSowingChanges_Report119 };
};
