export abstract class MapProperty<TIncomingObjectType, TInType, TOutType> {
  #property: keyof TIncomingObjectType;

  constructor(property: keyof TIncomingObjectType) {
    this.#property = property;
  }
  propertyName(): keyof TIncomingObjectType {
    return this.#property;
  }

  abstract map(value: TInType): TOutType;
}
