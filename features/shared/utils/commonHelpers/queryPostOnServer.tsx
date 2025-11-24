import axios from "axios";

export async function query_postDataAsServerAction<T, K>(
  baseURL: string,
  queryAddress: string,
  token: string,
  objectToBePosted: K
): Promise<T> {
  const response = await axios.post(
    `${baseURL}${queryAddress}`,
    objectToBePosted,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data as T;
}
