import { configPerBuild } from "../env/env";
import { toast } from "sonner-native";
import {
  AllZPsPerLocalizationWithInfoAboutAllLocalizations,
  AllZPsPerLocalizationWithInfoAboutAllLocalizationsResponse,
} from "../types/interfaces-zp";

import { LocalizationInfoPerScannedField } from "../types/interfaces-localization";
import { getRepId1587 } from "./getRepId1587";

export const useGetAllZPsInLocalizationWithAllLocalizationsInfo_Report1587 =
  () => {
    async function getAllZPsInLocalizationWithAllLocalizationsInfo_Report1587(
      token: string,
      planam: string,
      errorHandler: (error: Error, errorTitle?: string) => void
    ): Promise<AllZPsPerLocalizationWithInfoAboutAllLocalizations[] | null> {
      try {
        let response: AllZPsPerLocalizationWithInfoAboutAllLocalizationsResponse;
        response =
          await getRepId1587<AllZPsPerLocalizationWithInfoAboutAllLocalizationsResponse>(
            configPerBuild.apiAddress,
            planam,
            token
          );

        if (
          response.data.resultMainQuery === -1 ||
          response.data.resultMainQuery.length === 0
        ) {
          toast.error(`Brak ZPków w zeskanowanej lokalizacji (${planam}).`);
          return null;
        }

        const ZPsPerLocalizationWithInfoAboutAllLocalizations: AllZPsPerLocalizationWithInfoAboutAllLocalizations[] =
          response.data.resultMainQuery.map((el) => {
            const localizations: LocalizationInfoPerScannedField[] = (
              JSON.parse(el.to_json) as any[]
            ).map((loc) => ({
              id____: Number.parseInt(loc.id____),
              ile: Number.parseInt(loc.ile),
              ordout: Number.parseInt(loc.ordout),
              planam: loc.planam,
            }));

            return {
              ordnmb: el.ordnmb,
              sordid: Number.parseInt(el.sordid),
              localization: localizations,
            };
          });

        return ZPsPerLocalizationWithInfoAboutAllLocalizations;
      } catch (error) {
        errorHandler(error as Error);
      }

      return null;
    }

    return { getAllZPsInLocalizationWithAllLocalizationsInfo_Report1587 };
  };
