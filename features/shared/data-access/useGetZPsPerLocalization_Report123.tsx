import { toast } from "sonner-native";
import { configPerBuild } from "../env/env";
import {
  ZPInLocalizationInfo,
  ZPsInLocalizationInfoResponse,
} from "../types/interfaces-zp";
import { getRepId123 } from "./getRepId123";

export const useGetZPsPerLocalization_Report123 = () => {
  async function getZPsPerLocalization_Report123(
    token: string,
    field: string,
    errorHandler: (error: Error, errorTitle?: string) => void
  ): Promise<ZPInLocalizationInfo[] | null> {
    let response: ZPsInLocalizationInfoResponse;
    try {
      response = await getRepId123(configPerBuild.apiAddress, field, token);

      if (
        response.data.resultMainQuery === -1 ||
        response.data.resultMainQuery.length === 0
      ) {
        toast.error(
          `Brak informacji o ZPkach na zeskanowanej lokalizacji (${field}).`
        );
        return null;
      }

      const zpsPerLocalizationDTO = response.data.resultMainQuery;

      const zpsPerLocalization: ZPInLocalizationInfo[] =
        zpsPerLocalizationDTO.map((zp) => ({
          ordnmb: zp.ordnmb,
          sordid: Number.parseInt(zp.sordid),
          planam: zp.planam,
          stkcnt: Number.parseInt(zp.stkcnt),
          mvplok: zp.mvplok === "t" ? true : false,
        }));

      return zpsPerLocalization;
    } catch (error) {
      errorHandler(error as Error);
    }

    return null;
  }

  return { getZPsPerLocalization_Report123 };
};
