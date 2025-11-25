import { MapProperty } from "../interfaces/MapProperty";
import { MapHelpers } from "./mapHelpers";

export class MapStringIntoInteger<T extends Object> extends MapProperty<
  T,
  string,
  number
> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): number {
    if (!MapHelpers.checkIfStringIsNumeric(value))
      throw new Error(
        "MapStringIntoInteger -> value cannot be mapped to number"
      );
    return Number.parseInt(value);
  }
}
