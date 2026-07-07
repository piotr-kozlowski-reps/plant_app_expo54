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

const chemicalTreatmentsDonObjectExample: ProtectiveTreatment = {
  id____: 2345245,
  dscrpt: "jyfgv",
  typ: "ZABIEGI",
  params: null,
};

/**
 * @public
 * @reportItem
 * raport - zabiegi chemiczne - DON:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1736</b>
 */
const edocReport_ChemicalTreatmentsDon = new EdocReport<
  ProtectiveTreatmentDTO,
  ProtectiveTreatment
>({
  dataName: "chemicalTreatmentsDon",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ChemicalTreatmentsDon}`,
  queryKey: [QUERY_KEYS.CHEMICAL_TREATMENTS_DON],
  requiredPropertiesInResultObject: Object.keys(
    chemicalTreatmentsDonObjectExample,
  ) as (keyof ProtectiveTreatment)[],
  sort: new SortByProperty<ProtectiveTreatmentDTO>("dscrpt"),
  mappers: [
    new MapStringIntoInteger<ProtectiveTreatment>("id____"),
    new MapDoNotMap<ProtectiveTreatment, string>("dscrpt"),
    new MapDoNotMap<ProtectiveTreatment, string>("typ"),
    new MapStringOrNullIntoParamsNitrogenObjectOrNull<ProtectiveTreatment>(
      "params",
    ),
  ],
});

export default edocReport_ChemicalTreatmentsDon;
