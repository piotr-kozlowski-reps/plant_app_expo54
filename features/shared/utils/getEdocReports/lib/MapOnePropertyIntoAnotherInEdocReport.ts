import { TMapper } from "./types";

export class MapOnePropertyIntoAnotherInEdocReport<
  TDataDTOType,
  TInType,
  TOutType,
> {
  #propertyName: keyof TDataDTOType;
  #mapper: TMapper<TInType, TOutType>;

  constructor(
    propertyName: keyof TDataDTOType,
    mapper: TMapper<TInType, TOutType>
  ) {
    this.#propertyName = propertyName;
    this.#mapper = mapper;
  }

  ////methods
  propertyName() {
    return this.#propertyName;
  }

  mapper() {
    return this.#mapper;
  }
}
