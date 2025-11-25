export type TEdocCustomRegisterData = {
  address: string;
  queryKeysToBeRevalidated: string[];
};

/**
 * <TBase, TPost>
 * type TBase - final object type
 * type TPost - DTO post data
 */
export class EdocCustomRegister<TBase, TPost> {
  #address: string;
  #queryKeysToBeRevalidated: string[];

  constructor(edocCustomRegisterData: TEdocCustomRegisterData) {
    this.#address = edocCustomRegisterData.address;
    this.#queryKeysToBeRevalidated =
      edocCustomRegisterData.queryKeysToBeRevalidated;
  }

  //methods
  address(): string {
    return this.#address;
  }
  queryKeysToBeRevalidated(): string[] {
    return this.#queryKeysToBeRevalidated;
  }
}
