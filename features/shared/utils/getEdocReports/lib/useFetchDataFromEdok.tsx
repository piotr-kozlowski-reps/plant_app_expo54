// import { QueryKey, useQuery, useMutation } from "@tanstack/react-query";
// import { query_getDataAsServerAction } from "../../commonHelpers/queryGetOnServer";
// import { EdocFetchingStrategy } from "./EdocReport";
// import { useEffect, useState } from "react";

// export function useFetchDataFromEdok<T>(
//   fetchingStrategy: EdocFetchingStrategy,
//   config: {
//     queryKey: QueryKey;
//     baseURL: string;
//     address: string;
//     token: string;
//   }
// ): {
//   data: T | undefined;
//   isLoading: boolean;
//   isFetching: boolean;
//   isError: boolean;
//   refetch: () => void;
//   error: Error | null;
// } {
//   if (fetchingStrategy === "DEFAULT_API") {
//     const { data, isLoading, isFetching, isError, refetch, error } =
//       useQuery<T>({
//         queryKey: config.queryKey,
//         queryFn: async (): Promise<T> => {
//           const dataFetched = await query_getDataAsServerAction<T>(
//             config.baseURL,
//             config.address,
//             config.token
//           );
//           return dataFetched;
//         },
//       });
//     return { data, isLoading, isFetching, isError, refetch, error };
//   }

//   // const[isCustomLoading , setIsCustomLoading] = useState(false)
//   // if (fetchingStrategy === "CUSTOM_API") {

//   //   const { data, isPending, isError, refetch, error } =
//   //     useMutation<T, Error, any extends Object>({})

//   //   return { data, isLoading, isFetching, isError, refetch, error };
//   // }

//   throw new Error("useFetchDataFromEdok - unsupported fetching strategy");
// }
