import { QUERY_KEYS } from "../constants/queryKeys";
import {
  Localization,
  LocalizationDTO,
} from "../types/interfaces-localization";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { SortByProperty } from "../utils/getEdocReports/lib/sorting/implementations/SortByProperty";

const availableLocalizationsObjectExample: Localization = {
  id____: 12345,
  planam: "sdv",
};

const edocReport_AvailableLocalizations = new EdocReport<
  LocalizationDTO,
  Localization
>({
  dataName: "availableLocalizations",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=1580&planam=ALL`,
  queryKey: [QUERY_KEYS.AVAILABLE_LOCALIZATIONS],
  requiredPropertiesInResultObject: Object.keys(
    availableLocalizationsObjectExample
  ) as (keyof Localization)[],
  sort: new SortByProperty("planam"),
  mappers: [
    new MapDoNotMap<Localization, string>("planam"),
    new MapStringIntoInteger<Localization>("id____"),
  ],
});

export default edocReport_AvailableLocalizations;
