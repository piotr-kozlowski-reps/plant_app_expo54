import { MapProperty } from "../interfaces/MapProperty";

export class MapStringValueTorFIntoBoolean<
  T extends Object,
> extends MapProperty<T, string, boolean> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): boolean {
    if (value !== "t" && value !== "f") {
      throw new Error(
        "MapStringValueTorFIntoBoolean -> value is not t or f so it cannot be mapped to boolean"
      );
    }
    return value === "t" ? true : false;
  }
}
