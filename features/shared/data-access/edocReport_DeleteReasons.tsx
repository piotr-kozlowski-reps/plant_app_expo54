import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";

import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";
import { SortByProperty } from "../utils/getEdocReports/lib/sorting/implementations/SortByProperty";
import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import {
  DeleteReason,
  DeleteReasonDTO,
} from "../types/interfaces-disconnect_from_zp";

const deleteReasonsObjectExample: DeleteReason = {
  keyval: 1234123,
  delete_reason_id: 1234123,
  delete_dscrpt: "sdfvfd",
};

const edocReport_DeleteReasons = new EdocReport<DeleteReasonDTO, DeleteReason>({
  dataName: "deleteReasons",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_DeleteReasons}`,
  queryKey: [QUERY_KEYS.DELETE_REASONS],
  requiredPropertiesInResultObject: Object.keys(
    deleteReasonsObjectExample
  ) as (keyof DeleteReason)[],
  sort: new SortByProperty("delete_dscrpt"),
  mappers: [
    new MapStringIntoInteger<DeleteReasonDTO>("keyval"),
    new MapStringIntoInteger<DeleteReasonDTO>("delete_reason_id"),
    new MapDoNotMap<DeleteReasonDTO, string>("delete_dscrpt"),
  ],
});

export default edocReport_DeleteReasons;
