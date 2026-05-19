import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import {
  CotyledonQuilting,
  CotyledonQuiltingDTO,
} from "../types/interfaces-cotyledon_quilting";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { MapStringValueTorFIntoBoolean } from "../utils/getEdocReports/lib/mapping/implementations/MapStringValueTorFIntoBoolean";
// import { MapStringIntoDate } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoDate";

const cotyledonQuiltingListObjectExample: CotyledonQuilting = {
  sordid: 3456,
  ordnmb: "sdfg",
  open: true,
  pcm_ilosc: "",
  twr_kod: "",
  twr_nazwa: "",
};

const edocReport_zpToCotyledonQuilting = new EdocReport<
  CotyledonQuiltingDTO,
  CotyledonQuilting
>({
  dataName: "zpToCotyledonQuilting",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_zpToCotyledonQuilting}`,
  queryKey: [QUERY_KEYS.COTYLEDON_QUILTING],
  requiredPropertiesInResultObject: Object.keys(
    cotyledonQuiltingListObjectExample,
  ) as (keyof CotyledonQuilting)[],
  sort: new NoSort(),
  mappers: [
    new MapStringIntoInteger<CotyledonQuilting>("sordid"),
    new MapDoNotMap<CotyledonQuilting, string>("ordnmb"),
    new MapStringValueTorFIntoBoolean<CotyledonQuilting>("open"),
    new MapDoNotMap<CotyledonQuilting, string>("pcm_ilosc"),
    new MapDoNotMap<CotyledonQuilting, string>("twr_kod"),
    new MapDoNotMap<CotyledonQuilting, string>("twr_nazwa"),
  ],
});

export default edocReport_zpToCotyledonQuilting;
