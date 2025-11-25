import { MapProperty } from "../interfaces/MapProperty";

export class MapStringOrNullIntoUserParticipationValuesOrNull<
  T extends Object
> extends MapProperty<
  T,
  string | null,
  null | "not_declared" | "confirm" | "not_confirm"
> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): null | "not_declared" | "confirm" | "not_confirm" {
    if (!value) return null;
    if (value === "not_declared") return "not_declared";
    if (value === "confirm") return "confirm";
    if (value === "not_confirm") return "not_confirm";
    throw new Error(
      "MapStringOrNullIntoUserParticipationValuesOrNull -> value cannot be mapped to UserParticipationValues: not_declared, confirm, not_confirm"
    );
  }
}
