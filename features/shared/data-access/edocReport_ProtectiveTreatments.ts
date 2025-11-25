import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentDTO,
} from "../types/interfaces-protective_treatment";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { SortByProperty } from "../utils/getEdocReports/lib/sorting/implementations/SortByProperty";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringOrNullIntoParamsNitrogenObjectOrNull } from "../utils/getEdocReports/lib/mapping/implementations/MapStringOrNullIntoParamsNitrogenObjectOrNull";

const protectiveTreatmentsObjectExample: ProtectiveTreatment = {
  id____: 2345245,
  dscrpt: "jyfgv",
  typ: "ZABIEGI",
  params: null,
};

const edocReport_ProtectiveTreatments = new EdocReport<
  ProtectiveTreatmentDTO,
  ProtectiveTreatment
>({
  dataName: "protectiveTreatments",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ProtectiveTreatments}`,
  queryKey: [QUERY_KEYS.PROTECTIVE_TREATMENTS],
  requiredPropertiesInResultObject: Object.keys(
    protectiveTreatmentsObjectExample
  ) as (keyof ProtectiveTreatment)[],
  sort: new SortByProperty<ProtectiveTreatmentDTO>("dscrpt"),
  mappers: [
    new MapStringIntoInteger<ProtectiveTreatment>("id____"),
    new MapDoNotMap<ProtectiveTreatment, string>("dscrpt"),
    new MapDoNotMap<ProtectiveTreatment, string>("typ"),
    new MapStringOrNullIntoParamsNitrogenObjectOrNull<ProtectiveTreatment>(
      "params"
    ),
  ],
});

export default edocReport_ProtectiveTreatments;
