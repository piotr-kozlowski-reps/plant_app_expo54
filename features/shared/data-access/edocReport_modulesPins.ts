// import { configPerBuild } from "../env/env";
// import {
//   ProtectiveTreatment,
//   ProtectiveTreatmentDTO,
// } from "../types/interfaces-protective_treatment";
import { configPerBuild } from "../env/env";
import { ModulePin, ModulePinDTO } from "../types/interfaces-tray_operations";

import { NoSort } from "../utils/getEdocReports/lib/sorting/implementations/NoSort";
// import { SortByProperty } from "../utils/getEdocReports/lib/sorting/implementations/SortByProperty";
// import { MapStringIntoInteger } from "../utils/getEdocReports/lib/mapping/implementations/MapStringIntoInteger";
import { MapDoNotMap } from "../utils/getEdocReports/lib/mapping/implementations/MapDoNotMap";
import { QUERY_KEYS } from "../constants/queryKeys";
import { EdocReport } from "../utils/getEdocReports/lib/EdocReport";

const modulesPinsObjectExample: ModulePin = {
  module_name: "sdfgbvsgdf",
  module_pin: "3455",
};

const edocReport_modulesPins = new EdocReport<ModulePinDTO, ModulePin>({
  dataName: "modulesPins",
  address: `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ModulesPins}&module=GRUNT`,
  queryKey: [QUERY_KEYS.MODULES_PINS],
  requiredPropertiesInResultObject: Object.keys(
    modulesPinsObjectExample
  ) as (keyof ModulePin)[],
  sort: new NoSort(),
  mappers: [
    new MapDoNotMap<ModulePin, string>("module_name"),
    new MapDoNotMap<ModulePin, string>("module_pin"),
  ],
});

export default edocReport_modulesPins;
