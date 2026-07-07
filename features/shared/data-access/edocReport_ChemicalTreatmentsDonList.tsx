import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoDate } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoDate";
import {
  ZpToChemicalTreatments,
  ZpToChemicalTreatmentsDTO,
} from "../types/interfaces-chemical_treatments_don";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";

const chemicalTreatmentDonListObjectExample: ZpToChemicalTreatments = {
  plan_id: 2345,
  chemical_treatment_date: new Date(Date.now()),
  ordnmb: "asdfvdf",
  sordid: 12345,
  treatid: 1345,
  tredscrpt: "sdfvsdfv",
};

/**
 * @public
 * @reportItem
 * raport - lista zleconych ZPeków do zabiegu chemicznego DON:
 * <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1738</b>
 */
const edocReport_ChemicalTreatmentsDonList = new EdocReport<
  ZpToChemicalTreatmentsDTO,
  ZpToChemicalTreatments
>({
  dataName: "zps_to_chemical_treatments_don",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ChemicalTreatmentsDonList}`,
  queryKey: [QUERY_KEYS.CHEMICAL_TREATMENTS_DON_LIST],
  requiredPropertiesInResultObject: Object.keys(
    chemicalTreatmentDonListObjectExample,
  ) as (keyof ZpToChemicalTreatments)[],
  sort: new NoSort(),
  mappers: [
    new MapStringIntoInteger<ZpToChemicalTreatments>("plan_id"),
    new MapStringIntoDate<ZpToChemicalTreatments>("chemical_treatment_date"),
    new MapStringIntoInteger<ZpToChemicalTreatments>("sordid"),
    new MapDoNotMap<ZpToChemicalTreatments, string>("ordnmb"),
    new MapStringIntoInteger<ZpToChemicalTreatments>("treatid"),
    new MapDoNotMap<ZpToChemicalTreatments, string>("tredscrpt"),
  ],
});

export default edocReport_ChemicalTreatmentsDonList;
