import { MapProperty } from "../interfaces/MapProperty";
import { MapHelpers } from "./mapHelpers";

export class MapStringIntoDate<T extends Object> extends MapProperty<
  T,
  string,
  Date
> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): Date {
    if (!MapHelpers.checkIsStringValidToCreateADateObject(value))
      throw new Error(
        `MapStringIntoDate -> value (${value} in property:  ${this.propertyName}) cannot be mapped to Date`
      );
    return new Date(value);
  }
}
