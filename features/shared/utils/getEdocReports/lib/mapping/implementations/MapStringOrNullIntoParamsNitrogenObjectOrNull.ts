import { NitrogenParam } from "@/features/shared/types/interfaces-protective_treatment";
import { MapProperty } from "../interfaces/MapProperty";

export class MapStringOrNullIntoParamsNitrogenObjectOrNull<
  T extends Object
> extends MapProperty<T, string | null, null | NitrogenParam> {
  constructor(property: keyof T) {
    super(property);
  }

  map(value: string | null): null | NitrogenParam {
    if (!value) return null;

    const nitrogenParam: any = JSON.parse(value);
    const nitrogenValue: string = nitrogenParam.nitrogen;

    if (!nitrogenValue) {
      throw new Error(
        "MapStringOrNullIntoParamsNitrogenObjectOrNull -> value cannot be mapped to NitrogenParam: no nitrogen value"
      );
    }

    const nitrogen: NitrogenParam = {
      nitrogen: nitrogenValue === "true" ? true : false,
    };

    return nitrogen;
  }
}
