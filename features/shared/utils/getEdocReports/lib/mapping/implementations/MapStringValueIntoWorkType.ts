import { MapProperty } from "../interfaces/MapProperty";

import { WorkType } from "@/features/shared/types/interfaces-works_planning";

export class MapStringValueIntoWorkType<T extends object> extends MapProperty<
  T,
  string,
  WorkType
> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): WorkType {
    if (value !== "TECH" && value !== "EXTRA") {
      throw new Error(
        "MapStringValueIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
      );
    }
    if (value === "EXTRA") return "EXTRA";
    if (value === "TECH") return "TECH";

    throw new Error(
      "MapStringValueIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
    );
  }
}
