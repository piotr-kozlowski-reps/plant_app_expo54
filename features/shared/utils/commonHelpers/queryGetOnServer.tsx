import axios from "axios";

export async function query_getDataAsServerAction<T>(
  baseURL: string,
  queryAddress: string,
  token: string
): Promise<T> {
  const response = await axios.get(`${baseURL}${queryAddress}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as T;
}
