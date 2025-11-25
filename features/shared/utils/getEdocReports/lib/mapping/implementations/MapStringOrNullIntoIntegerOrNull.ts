import { MapProperty } from "../interfaces/MapProperty";
import { MapHelpers } from "./mapHelpers";
import { MapStringIntoInteger } from "./MapStringIntoInteger";

export class MapStringOrNullIntoIntegerOrNull<
  T extends Object,
> extends MapProperty<T, string | null, number | null> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): number | null {
    if (!value) return null;
    // if (!MapHelpers.checkIfStringIsNumeric(value)) return null;
    const mapStringIntoInteger = new MapStringIntoInteger<T>(
      this.propertyName()
    );
    return mapStringIntoInteger.map(value);
  }
}
