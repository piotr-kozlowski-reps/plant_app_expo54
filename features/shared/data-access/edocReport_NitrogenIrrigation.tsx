import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoDate } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoDate";
import {
  ZpToNitrogenIrrigation,
  ZpToNitrogenIrrigationDTO,
} from "../types/interfaces-nitrogen_irrigation";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";

const nitrogenIrrigationListObjectExample: ZpToNitrogenIrrigation = {
  plan_id: 2345,
  nitrogen_irrigation_date: new Date(Date.now()),
  ordnmb: "asdfvdf",
  sordid: 12345,
  treatid: 1345,
  tredscrpt: "sdfvsdfv",
};

const edocReport_NitrogenIrrigationList = new EdocReport<
  ZpToNitrogenIrrigationDTO,
  ZpToNitrogenIrrigation
>({
  dataName: "zps_to_nitrogen_irrigation",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_NitrogenIrrigationList}`,
  queryKey: [QUERY_KEYS.NITROGEN_IRRIGATION_LIST],
  requiredPropertiesInResultObject: Object.keys(
    nitrogenIrrigationListObjectExample
  ) as (keyof ZpToNitrogenIrrigation)[],
  sort: new NoSort(),
  mappers: [
    new MapStringIntoInteger<ZpToNitrogenIrrigation>("plan_id"),
    new MapStringIntoDate<ZpToNitrogenIrrigation>("nitrogen_irrigation_date"),
    new MapStringIntoInteger<ZpToNitrogenIrrigation>("sordid"),
    new MapDoNotMap<ZpToNitrogenIrrigation, string>("ordnmb"),
    new MapStringIntoInteger<ZpToNitrogenIrrigation>("treatid"),
    new MapDoNotMap<ZpToNitrogenIrrigation, string>("tredscrpt"),
  ],
});

export default edocReport_NitrogenIrrigationList;
