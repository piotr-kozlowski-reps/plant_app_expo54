import axios from "axios";

export async function query_deleteDataAsServerAction<T>(
  baseURL: string,
  queryAddress: string,
  token: string,
  id: string | number
): Promise<T> {
  const response = await axios.delete(`${baseURL}${queryAddress}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data as T;
}
