// import axios from "axios";
// import { configPerBuild } from "../env/env";

// export async function query_getDataFromReport<T>(
//   queryAddress: string
// ): Promise<T[]> {

//   type DTOReportReturnType = {
//     data: {
//       resultMainQuery: T[] | -1;
//     };
//   };

//   const response = await axios.get<DTOReportReturnType>(
//     `${configPerBuild.apiAddress}${queryAddress}`,
//     {
//       headers: {
//         Authorization: `Bearer ${user.tokens.token}`,
//       },
//     }
//   );

//   const resultMainQuery = response.data.data.resultMainQuery;
//   if (!resultMainQuery) {
//     throw new Error("query_getDataFromReport -> resultMainQuery is undefined");
//   }
//   if (resultMainQuery === -1) {
//     return [] as T[];
//   }

//   return resultMainQuery as T[];
// }

// // export async function query_getDataFrom_getRegisterFieldParamsApi<T>(
// //   queryAddress: string
// // ): Promise<T[]> {
// //   const user = await requireUser();

// //   type DTORegisterFieldParamsApiReturnType = {
// //     data: T[] | -1;
// //   };
// //   const response = await axios.get<DTORegisterFieldParamsApiReturnType>(
// //     `${env.NEXT_PUBLIC_API_URL}${queryAddress}`,
// //     {
// //       headers: {
// //         Authorization: `Bearer ${user.tokens.token}`,
// //       },
// //     }
// //   );
// //   const data = response.data.data;
// //   if (!data) {
// //     throw new Error(
// //       "query_getDataFrom_getRegisterFieldParamsApi -> data is undefined"
// //     );
// //   }
// //   if (data === -1) {
// //     return [] as T[];
// //   }
// //   return data as T[];
// // }

// // export async function query_getDataFrom_getKorsolGetFiltersReport<T>(
// //   queryAddress: string,
// //   filterKey: string
// // ): Promise<T[]> {
// //   const user = await requireUser();

// //   type KorsolFilterReportApiReturnTypeDTO =
// //     | {
// //         data: {
// //           [key: string]: T[];
// //         };
// //       }
// //     | {
// //         data: {
// //           resultMainQuery: -1;
// //         };
// //       };

// //   const response = await axios.get<KorsolFilterReportApiReturnTypeDTO>(
// //     `${env.NEXT_PUBLIC_API_URL}${queryAddress}`,
// //     {
// //       headers: {
// //         Authorization: `Bearer ${user.tokens.token}`,
// //       },
// //     }
// //   );

// //   const data = response.data.data;
// //   if (!data) {
// //     throw new Error(
// //       "query_getDataFrom_getRegisterFieldParamsApi -> data is undefined"
// //     );
// //   }

// //   if ("resultMainQuery" in data) {
// //     return [] as T[];
// //   }

// //   const filterDataExtracted = data[filterKey];
// //   return filterDataExtracted as T[];
// // }
