import { QUERY_KEYS } from "../constants/queryKeys";
import { WorkToPlanDTO, WorkToPlan } from "../types/interfaces-works_planning";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapStringValueIntoWorkType } from "../utils/getEdocReports/lib/mapping/implementations/MapStringValueIntoWorkType";

const availableWorksToPlanObjectExample: WorkToPlan = {
  ptc_kod: "sdv",
  prior_: 12345,
  type__: "TECH",
};

const edocReport_AvailableWorksToChooseInGreenhouseCrops = new EdocReport<
  WorkToPlanDTO,
  WorkToPlan
>({
  dataName: "works_to_plan",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=1626`,
  queryKey: [QUERY_KEYS.WORKS_TO_PLAN],
  requiredPropertiesInResultObject: Object.keys(
    availableWorksToPlanObjectExample,
  ) as (keyof WorkToPlan)[],
  sort: new NoSort(),
  mappers: [
    new MapDoNotMap<WorkToPlan, string>("ptc_kod"),
    new MapStringIntoInteger<WorkToPlan>("prior_"),
    new MapStringValueIntoWorkType<WorkToPlan>("type__"),
  ],
});

export default edocReport_AvailableWorksToChooseInGreenhouseCrops;
