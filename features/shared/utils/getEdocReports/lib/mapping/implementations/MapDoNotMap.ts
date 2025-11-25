import { MapProperty } from "../interfaces/MapProperty";

export class MapDoNotMap<T extends Object, U> extends MapProperty<T, U, U> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: U): U {
    return value;
  }
}
