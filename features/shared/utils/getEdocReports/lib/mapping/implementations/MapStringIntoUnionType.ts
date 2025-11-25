import { MapProperty } from "../interfaces/MapProperty";

export class MapStringIntoUnionType<
  T extends Object,
  DesiredUnionType,
> extends MapProperty<T, string, DesiredUnionType> {
  #unionValues: string[];
  constructor(property: keyof T, unionValues: string[]) {
    super(property);
    this.#unionValues = unionValues;
  }
  map(value: string): DesiredUnionType {
    if (!value || typeof value !== "string") {
      throw new Error(
        "MapStringIntoUnionType -> value cannot be mapped to DesiredUnionType"
      );
    }

    const isValueInUnion = this.#unionValues.some(
      (unionValue) => value === unionValue
    );
    if (!isValueInUnion) {
      throw new Error(
        "MapStringIntoUnionType -> value cannot be mapped to DesiredUnionType"
      );
    }

    return value as DesiredUnionType;
  }
}
