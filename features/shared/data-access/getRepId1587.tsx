import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

export async function getRepId1587<T>(
  baseURL: string,
  planam: string,
  token: string
): Promise<T> {
  //   const queryAddress = getRightQueryAddress(ordnmbOrStk_id);

  const response = await query_getDataAsServerAction<T>(
    baseURL,
    `/api.php/REST/custom/korsolgetreport?rep_id=1587&planam=${planam}`,
    token
  );

  return response as T;
}
