import { Sort } from "../interfaces/Sort";

export class SortWithCustomCallback<T extends Object> implements Sort<T> {
  #callbackFn: (dataArray: T[]) => T[];

  constructor(callbackFn: (dataArray: T[]) => T[]) {
    this.#callbackFn = callbackFn;
  }

  sort(data: T[]): T[] {
    return this.#callbackFn(data);
  }
}
