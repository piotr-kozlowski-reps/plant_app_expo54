import { Sort } from "../interfaces/Sort";

export class NoSort<T> implements Sort<T> {
  sort(data: T[]): T[] {
    return data;
  }
}
