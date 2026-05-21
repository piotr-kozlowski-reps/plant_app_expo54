import { configPerBuild } from "@/features/shared/env/env";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export async function getRepId1711<T>(
  baseURL: string,
  stk_id: string,
  token: string,
): Promise<T> {
  const response = await query_getDataAsServerAction<T>(
    baseURL,
    `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_TrayForDonInfo}&stk_id=${stk_id}`,
    token,
  );

  return response as T;
}
