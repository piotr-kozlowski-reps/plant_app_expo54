import { QUERY_KEYS } from "../constants/queryKeys";
import {
  ZpInProduction,
  ZpInProductionDTO,
} from "../types/interfaces-zps_in_production";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";

const zpsInProductionObjectExample: ZpInProduction = {
  ordnmb: "sdfvgdsf",
  sordid: 0,
};

const edocReport_ZPsInProduction = new EdocReport<
  ZpInProductionDTO,
  ZpInProduction
>({
  dataName: "ZPsInProduction",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=1694`,
  queryKey: [QUERY_KEYS.ZPS_IN_PRODUCTION],
  requiredPropertiesInResultObject: Object.keys(
    zpsInProductionObjectExample
  ) as (keyof ZpInProduction)[],
  sort: new NoSort(),
  mappers: [
    new MapDoNotMap<ZpInProduction, string>("ordnmb"),
    new MapStringIntoInteger<ZpInProduction>("sordid"),
  ],
});

export default edocReport_ZPsInProduction;
