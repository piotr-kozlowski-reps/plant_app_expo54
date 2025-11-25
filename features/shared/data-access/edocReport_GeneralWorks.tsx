import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { GeneralWork, GeneralWorkDTO } from "../types/interfaces-general_works";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";

const generalWorksObjectExample: GeneralWork = {
  keyval: 2345245,
  acname: "jyfgv",
  module_id: "ZABIEGI",
};

const edocReport_GeneralWorks = new EdocReport<GeneralWorkDTO, GeneralWork>({
  dataName: "generalWorks",
  address: `/api.php/REST/custom/korsolgetreport?module=GRUNT&rep_id=${configPerBuild.edocReport_GeneralWorks}`,
  queryKey: [QUERY_KEYS.GENERAL_WORKS],
  requiredPropertiesInResultObject: Object.keys(
    generalWorksObjectExample
  ) as (keyof GeneralWork)[],
  sort: new NoSort(),
  mappers: [
    new MapStringIntoInteger<GeneralWork>("keyval"),
    new MapDoNotMap<GeneralWork, string>("acname"),
    new MapDoNotMap<GeneralWork, string>("module_id"),
  ],
});

export default edocReport_GeneralWorks;
