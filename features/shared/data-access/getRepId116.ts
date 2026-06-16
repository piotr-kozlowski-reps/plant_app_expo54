import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import {
  ZPLocalizationInfoPlusQuantityToBeMoved,
  ZPLocalizationInfoResponse,
} from "../types/interfaces-zp";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";

/**
 * @public
 * @reportItem
 * raport - lokalizacje ZP:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>116</b>&ordnmb=<b>%ordnmb%</b>&module=<b>SZKLO</b>(dla ROZ) / <b>GRUNT</b>(dla reszty)
 */
export async function getRepId116(
  token: string,
  ZPWithoutAdditional_ZLEC: string,
  isRoz?: boolean,
): Promise<ZPLocalizationInfoPlusQuantityToBeMoved[] | null> {
  const response =
    await query_getDataAsServerAction<ZPLocalizationInfoResponse>(
      configPerBuild.apiAddress,
      `/api.php/REST/custom/korsolgetreport?rep_id=${
        configPerBuild.edocReport_ZPLocalizationInfo
      }&ordnmb=${ZPWithoutAdditional_ZLEC}&module=${isRoz ? "SZKLO" : "GRUNT"}`,
      token,
    );

  if (
    response.data.resultMainQuery === -1 ||
    response.data.resultMainQuery.length === 0
  ) {
    toast.error(
      `ZP o podanym ID (${ZPWithoutAdditional_ZLEC}) nie posiada żadnej lokalizacji.`,
    );
    return null;
  }

  const ZPLocalizationInfoDTO = response.data.resultMainQuery;
  const ZPLocalizationInfo: ZPLocalizationInfoPlusQuantityToBeMoved[] =
    ZPLocalizationInfoDTO.map((item) => ({
      id____: Number.parseInt(item.id____),
      dscrpt: item.dscrpt,
      ile: Number.parseInt(item.ile),
      ordout: Number.parseInt(item.ordout),
      quantity_to_be_moved: 0,
    }));

  return ZPLocalizationInfo;
}
