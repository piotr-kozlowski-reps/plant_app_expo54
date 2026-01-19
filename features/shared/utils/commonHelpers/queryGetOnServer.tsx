import axios from "axios";

export async function query_getDataAsServerAction<T>(
  baseURL: string,
  queryAddress: string,
  token: string,
): Promise<T> {
  console.log("query_getDataAsServerAction");
  console.log({ baseURL });
  console.log({ token });
  console.log(`${baseURL}${queryAddress}`);
  const response = await axios.get(`${baseURL}${queryAddress}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log({ response });
  return response.data as T;
}
