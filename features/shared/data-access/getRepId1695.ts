import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import {
  TechnicalInformation,
  TechnicalInformationResponse,
} from "../types/interfaces-information";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";
import {
  mapStringIntoDate,
  mapStringIntoInteger,
  mapStringOrNullIntoDateOrNull,
  mapStringOrNullIntoIntegerOrNull,
} from "./mapping_helpers";

export async function getRepId1695(
  baseURL: string,
  token: string,
  ordnmb: string,
): Promise<TechnicalInformation[]> {
  const response =
    await query_getDataAsServerAction<TechnicalInformationResponse>(
      baseURL,
      `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_TechnicalInformation}&ordnmb=${ordnmb}`,
      token,
    );

  if (
    response.data.resultMainQuery === -1 ||
    response.data.resultMainQuery.length === 0
  ) {
    toast.error(`ZP: ${ordnmb} został odnaleziony w systemie.`);
    return [];
  }

  const mappedData: TechnicalInformation[] = response.data.resultMainQuery.map(
    (item) => ({
      ptc_kod: item.ptc_kod,
      twr_kod: item.twr_kod,
      twr_nazwa: item.twr_nazwa,
      ptc_lp: mapStringIntoInteger(item.ptc_lp),
      plan_xl: item.plan_xl,
      real_dt: item.real_dt,
      watch_dt: item.watch_dt,
      delta_days: mapStringOrNullIntoIntegerOrNull(item.delta_days),
      delta_days_watch: mapStringOrNullIntoIntegerOrNull(item.delta_days_watch),
    }),
  );

  return mappedData;
}
