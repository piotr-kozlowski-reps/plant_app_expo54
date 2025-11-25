import { QueryKey } from "@tanstack/react-query";
import { Sort } from "./sorting/interfaces/Sort";
import { MapProperty } from "./mapping/interfaces/MapProperty";

type RequiredField<T, Field extends keyof T> = Omit<T, Field> &
  Required<Pick<T, Field>>;

export type TEdocReportData<
  TtypeDTO extends Object,
  TTypeFinalObject extends Object
> = {
  dataName: string;
  address: string;
  queryKey: QueryKey;
  requiredPropertiesInResultObject: Array<keyof TTypeFinalObject>;
  sort: Sort<TtypeDTO>;
  mappers: MapProperty<TtypeDTO, any, any>[];
};

export class EdocReport<
  TtypeDTO extends Object,
  TTypeFinalObject extends Object
> {
  #dataName: string;
  #address: string;
  #queryKey: QueryKey;
  #requiredPropertiesInResultObject: Array<keyof TTypeFinalObject>;
  #sort: Sort<TtypeDTO>;
  #mappers: MapProperty<TtypeDTO, any, any>[];

  constructor(edocReportData: TEdocReportData<TtypeDTO, TTypeFinalObject>) {
    this.#dataName = edocReportData.dataName;
    this.#address = edocReportData.address;
    this.#queryKey = edocReportData.queryKey;
    this.#requiredPropertiesInResultObject =
      edocReportData.requiredPropertiesInResultObject;
    this.#sort = edocReportData.sort;
    this.#mappers = edocReportData.mappers;
  }

  //methods
  dataName(): string {
    return this.#dataName;
  }
  address(): string {
    return this.#address;
  }
  queryKey(): QueryKey {
    return this.#queryKey;
  }
  requiredPropertiesInResultObject(): Array<keyof TTypeFinalObject> {
    return this.#requiredPropertiesInResultObject;
  }
  sort(data: TtypeDTO[]): TtypeDTO[] {
    return this.#sort.sort(data);
  }
  map(data: TtypeDTO[]): TTypeFinalObject[] {
    const mappedDataObjects: TTypeFinalObject[] = [];

    for (let item of data) {
      const mappedObject = this.mapItem(item, this.#mappers);
      mappedDataObjects.push(mappedObject);
    }

    return mappedDataObjects;
  }

  //private
  private mapItem(
    item: TtypeDTO,
    mappers: MapProperty<TtypeDTO, any, any>[]
  ): TTypeFinalObject {
    const object: any = {};

    for (let mapper of mappers) {
      const propertyName = mapper.propertyName();
      object[propertyName] = mapper.map(item[propertyName]);
    }

    this.checkAreFieldsDefinedAndIfNotThrowErrorWithNonexistingFieldName(
      object,
      this.requiredPropertiesInResultObject(),
      this.dataName()
    );

    return object as TTypeFinalObject;
  }

  private checkAreFieldsDefinedAndIfNotThrowErrorWithNonexistingFieldName<
    T extends {},
    U extends Array<keyof T>
  >(obj: T, fields: U, dateName: string): obj is RequiredField<T, U[number]> {
    for (let field of fields) {
      if (obj[field] === undefined)
        throw new Error(
          `areFieldsDefined -> in object: ${dateName}, required but not found field: ${String(
            field
          )}`
        );
    }

    return true;
  }
}
