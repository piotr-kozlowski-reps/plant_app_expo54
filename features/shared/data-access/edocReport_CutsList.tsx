import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { ZpToCut, ZpToCutDTO } from "../types/interfaces-cut";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringIntoDate } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoDate";

const cutsListObjectExample: ZpToCut = {
  id____: 234,
  sordid: 3456,
  ordnmb: "sdfg",
  plndat: new Date(),
  height: 234,
};

const edocReport_CutsList = new EdocReport<ZpToCutDTO, ZpToCut>({
  dataName: "zps_to_cut",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_CutsList}&type__=MANY`,
  queryKey: [QUERY_KEYS.CUTS_LIST],
  requiredPropertiesInResultObject: Object.keys(
    cutsListObjectExample
  ) as (keyof ZpToCut)[],
  sort: new NoSort(),
  mappers: [
    new MapStringIntoInteger<ZpToCut>("id____"),
    new MapStringIntoInteger<ZpToCut>("sordid"),
    new MapDoNotMap<ZpToCut, string>("ordnmb"),
    new MapStringIntoDate<ZpToCut>("plndat"),
    new MapStringIntoInteger<ZpToCut>("height"),
  ],
});

export default edocReport_CutsList;
