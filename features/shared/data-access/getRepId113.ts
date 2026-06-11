import { configPerBuild } from "@/features/shared/env/env";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

/**
 * if ordnmb (starts with ZP) -> query uses &ordnmb=${ordnmbOrStk_id}
 *
 * if stk_id (starts with TN or SK) -> query uses &stk_id=${ordnmbOrStk_id}
 */

/**
 * @public
 * @reportItem
 * @order 40
 * raport - informacje o ZP lub o tacy:
 * @separator
 * 1. jeżeli parametr to "ordnmb" i GRU:
 *    - <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>113</b>&ordnmb=<b>%ordnmb%</b>&module=<b>GRUNT</b>
 * 2. jeżeli parametr to "ordnmb" i ROZ:
 *    - <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>113</b>&ordnmb=<b>%ordnmb%</b>&module=<b>SZKLO</b>
 * 3. jeżeli parametr to "ordnmb" i DON:
 *    - <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>113</b>&ordnmb=<b>%ordnmb%</b>&module=<b>GRUNT</b>
 * 4. jeżeli parametr to "stk_id":
 *    - <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>113</b>&stk_id=<b>%stk_id%</b>&module=<b>GRUNT</b>
 */
export async function getRepId113<T>(
  baseURL: string,
  ordnmbOrStk_id: string,
  token: string,
): Promise<T> {
  const queryAddress = getRightQueryAddress(ordnmbOrStk_id);

  const response = await query_getDataAsServerAction<T>(
    baseURL,
    queryAddress,
    token,
  );

  return response as T;
}

////utils
function getRightQueryAddress(ordnmbOrStk_id: string): string {
  //zp
  if (ordnmbOrStk_id.startsWith("ZP-") && ordnmbOrStk_id.endsWith("GRU"))
    return `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZPDetailedInfo}&ordnmb=${ordnmbOrStk_id}&module=GRUNT`;

  if (ordnmbOrStk_id.startsWith("ZP-") && ordnmbOrStk_id.endsWith("ROZ"))
    return `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZPDetailedInfo}&ordnmb=${ordnmbOrStk_id}&module=SZKLO`;

  if (ordnmbOrStk_id.startsWith("ZP-") && ordnmbOrStk_id.endsWith("DON"))
    return `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZPDetailedInfo}&ordnmb=${ordnmbOrStk_id}&module=GRUNT`;

  //tray with SK
  if (ordnmbOrStk_id.startsWith("SK."))
    return `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZPDetailedInfo}&stk_id=${ordnmbOrStk_id}&module=GRUNT`;

  //tray with TN
  if (ordnmbOrStk_id.startsWith("TN."))
    return `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ZPDetailedInfo}&stk_id=${ordnmbOrStk_id}&module=GRUNT`;

  throw new Error("getRightQueryAddress -> couldn't find matching prefix.");
}
