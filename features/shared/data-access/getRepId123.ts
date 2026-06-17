import { ZPsInLocalizationInfoResponse } from "../types/interfaces-zp";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

/**
 * @public
 * @reportItem
 * raport - raport informacje o ZPkach na lokalizacji:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>123</b>&module=<b>GRUNT</b>&planam=<b>%planam%</b>`
 */
export async function getRepId123(
  baseURL: string,
  planam: string,
  token: string,
): Promise<ZPsInLocalizationInfoResponse> {
  const queryAddress = `/api.php/REST/custom/korsolgetreport?rep_id=123&module=GRUNT&planam=${planam}`;

  const response =
    await query_getDataAsServerAction<ZPsInLocalizationInfoResponse>(
      baseURL,
      queryAddress,
      token,
    );

  return response;
}
