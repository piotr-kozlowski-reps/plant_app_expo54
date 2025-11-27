import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { ExtraWork, ExtraWorkDTO } from "../types/interfaces-extra_works";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapStringValueTorFIntoBoolean } from "../utils/getEdocReports/lib/mapping/implementations/MapStringValueTorFIntoBoolean";
import { SortByProperty } from "../utils/getEdocReports/lib/sorting/implementations/SortByProperty";

const navigationObjectExample: ExtraWork = {
  keyval: 2345,
  activityname: "test",
  is_ordnmb: true,
  ishobby: true,
};

const edocReport_ExtraWorksRoz = new EdocReport<ExtraWorkDTO, ExtraWork>({
  dataName: "extra_works_roz",
  address: `/api.php/REST/v1/system/reports/${configPerBuild.edocReport_ExtraWorksRoz}/data`,
  queryKey: [QUERY_KEYS.EXTRA_WORKS_ROZ],
  requiredPropertiesInResultObject: Object.keys(
    navigationObjectExample
  ) as (keyof ExtraWork)[],
  sort: new SortByProperty("activityname"),
  mappers: [
    new MapDoNotMap<ExtraWork, string>("activityname"),
    new MapStringIntoInteger<ExtraWork>("keyval"),
    new MapStringValueTorFIntoBoolean<ExtraWork>("is_ordnmb"),
    new MapStringValueTorFIntoBoolean<ExtraWork>("ishobby"),
  ],
});

export default edocReport_ExtraWorksRoz;
