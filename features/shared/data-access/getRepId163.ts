import { configPerBuild } from "../env/env";
import { InformationResponse } from "../types/interfaces-information";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

/**
 * @public
 * @reportItem
 * raport - informacja o ZP:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>163</b>&<b>%params%</b>&module=<b>GRUNT</b>`;
 */
export async function getRepId163(
  baseURL: string,
  token: string,
  param: { name: string; value: string },
): Promise<InformationResponse> {
  const response = await query_getDataAsServerAction<InformationResponse>(
    baseURL,
    `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_Information}&${param.name}=${param.value}&module=GRUNT`,
    token,
  );

  return response as InformationResponse;
}
