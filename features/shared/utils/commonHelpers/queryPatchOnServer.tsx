import axios from "axios";

export async function query_patchDataAsServerAction<
  T,
  K extends { idOfPatchedItem: string | number }
>(
  baseURL: string,
  queryAddress: string,
  token: string,
  objectToBePatched: K
): Promise<T> {
  const copyOfPatchedObjectWithoutAdditionalId: any = { ...objectToBePatched };
  delete copyOfPatchedObjectWithoutAdditionalId.idOfPatchedItem;

  const response = await axios.patch(
    `${baseURL}${queryAddress}/${objectToBePatched.idOfPatchedItem}`,
    copyOfPatchedObjectWithoutAdditionalId,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data as T;
}
