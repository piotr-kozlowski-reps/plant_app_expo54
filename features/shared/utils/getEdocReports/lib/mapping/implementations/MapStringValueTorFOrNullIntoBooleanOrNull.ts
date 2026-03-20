import { MapProperty } from "../interfaces/MapProperty";

export class MapStringValueTorFOrNullIntoBooleanOrNull<
  T extends object,
> extends MapProperty<T, string | null, boolean | null> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): boolean | null {
    if (!value) return null;

    if (value !== "t" && value !== "f") {
      throw new Error(
        "MapStringValueTorFIntoBoolean -> value is not t or f so it cannot be mapped to boolean",
      );
    }
    return value === "t" ? true : false;
  }
}
