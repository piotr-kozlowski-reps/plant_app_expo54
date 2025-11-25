import { Sort } from "../interfaces/Sort";
type OrderType = "asc" | "desc";

export class SortByProperty<T extends Object> implements Sort<T> {
  #propertyToBeSortedBy: keyof T;
  #isInvert: OrderType;
  constructor(propertyToBeSortedBy: keyof T, isInvert: OrderType = "asc") {
    this.#propertyToBeSortedBy = propertyToBeSortedBy;
    this.#isInvert = isInvert;
  }

  sort(data: T[]): T[] {
    if (!data || data.length === 0) {
      return [] as T[];
    }

    const firstElObj = data[0] as T;
    if (this.#propertyToBeSortedBy in firstElObj === false) {
      throw new Error(
        "SortByProperty - passed object property does not exist in object."
      );
    }

    const dataCopy: T[] = [...data];
    dataCopy.sort((a: T, b: T): number => {
      const propertyA =
        typeof a[this.#propertyToBeSortedBy] === "string"
          ? (a[this.#propertyToBeSortedBy] as string).toLocaleLowerCase()
          : a[this.#propertyToBeSortedBy];
      const propertyB =
        typeof b[this.#propertyToBeSortedBy] === "string"
          ? (b[this.#propertyToBeSortedBy] as string).toLocaleLowerCase()
          : b[this.#propertyToBeSortedBy];

      if (propertyA > propertyB) return 1;
      if (propertyA < propertyB) return -1;
      return 0;
    });

    if (this.#isInvert === "desc") dataCopy.reverse();

    return dataCopy;
  }
}
