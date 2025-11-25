import { MapProperty } from "../interfaces/MapProperty";
import { MapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds } from "./MapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds";

export class MapStringWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSecondOrNullIntoDateOrNull<
  T extends Object
> extends MapProperty<T, string | null, Date | null> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): Date | null {
    if (!value) return null;
    const mapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds =
      new MapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds<T>(
        this.propertyName()
      );

    return mapStringIntoDateWithPattern_yearHyphenMonthHyphenDaySpaceHoursColonMinutesColonSeconds.map(
      value
    );
  }
}
