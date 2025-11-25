import { MapProperty } from "../interfaces/MapProperty";
import { MapHelpers } from "./mapHelpers";
import { parse } from "date-fns";

export class MapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds<
  T extends object
> extends MapProperty<T, string, Date> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string): Date {
    if (!MapHelpers.checkIsStringValidToCreateADateObject(value)) {
      throw new Error(
        `MapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds -> value (${value} of property: ${String(
          this.propertyName()
        )}) cannot be mapped to Date`
      );
    }
    return parse(value, "yyyy-MM-dd HH:mm:ss", new Date());
  }
}
