import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import { Localization } from "../types/interfaces-localization";
import { getRepId1580 } from "./getRepId1580";

/**
 * @public
 * @reportItem
 * @order 40
 * raport - informacja o lokalizacji:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1580</b>&planam=<b>%planam%</b>&module=<b>GRUNT</b>
 */
export const useGetLocalizationInfo_Report1580 = () => {
  async function getLocalizationInfoInfo_Report1580(
    token: string,
    planam: string,
    errorHandler: (error: Error, errorTitle?: string) => void,
  ): Promise<Localization | null> {
    try {
      const response = await getRepId1580(
        configPerBuild.apiAddress,
        planam,
        token,
      );

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toast.error(
          `Lokalizacja (${planam}) nie została odnaleziona w systemie.`,
        );
        return null;
      }

      const localizationInfoDTO = response.data.resultMainQuery[0];
      const localizationInfo: Localization = {
        id____: Number.parseInt(localizationInfoDTO.id____),
        planam: localizationInfoDTO.planam,
      };

      return localizationInfo;
    } catch (error) {
      errorHandler(error as Error);
    }
    return null;
  }
  return { getLocalizationInfoInfo_Report1580 };
};
