import { MapProperty } from "../interfaces/MapProperty";

export class MapStringIntoDesiredArray<T extends Object, U> extends MapProperty<
  T,
  string,
  U
> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): U {
    if (!value) {
      throw new Error(
        "MapStringIntoDesiredArray -> there's no string to be parsed"
      );
    }

    const stringIntoArray: U = JSON.parse(value);
    return stringIntoArray;
  }
}
