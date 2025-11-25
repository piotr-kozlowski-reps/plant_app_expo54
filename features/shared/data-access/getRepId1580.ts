import { configPerBuild } from "../env/env";
import { LocalizationResponse } from "../types/interfaces-localization";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export async function getRepId1580(
  baseURL: string,
  planam: string,
  token: string
): Promise<LocalizationResponse> {
  const response = await query_getDataAsServerAction<LocalizationResponse>(
    baseURL,
    `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_CheckLocalization}&planam=${planam}&module=GRUNT`,
    token
  );

  return response as LocalizationResponse;
}
