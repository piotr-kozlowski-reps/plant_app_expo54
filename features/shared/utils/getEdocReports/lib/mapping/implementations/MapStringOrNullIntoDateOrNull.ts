import { MapProperty } from "../interfaces/MapProperty";
import { MapStringIntoDate } from "./MapStringIntoDate";

export class MapStringOrNullIntoDateOrNull<
  T extends Object,
> extends MapProperty<T, string | null, Date | null> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): Date | null {
    if (!value) return null;
    const mapStringIntoDate = new MapStringIntoDate<T>(this.propertyName());
    return mapStringIntoDate.map(value);
  }
}
