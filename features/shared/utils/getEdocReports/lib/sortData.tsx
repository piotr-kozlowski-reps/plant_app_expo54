// import { ISort } from "./types";

// export function sortData<T extends Object>(data: T[], sort: ISort<T>): T[] {
//   if (!data || data.length === 0) {
//     return [] as T[];
//   }

//   //no sorting -> just return data
//   if (sort === "NONE") {
//     return data;
//   }

//   //passed property of T
//   if (typeof sort === "string" && sort !== "NONE") {
//     const firstElObj = data[0] as T;
//     if (sort in firstElObj === false) {
//       throw new Error(
//         "useSortData - passed object property does not exist in object."
//       );
//     }

//     const dataCopy: T[] = [...data];
//     dataCopy.sort((a: T, b: T): number => {
//       const propertyA =
//         typeof a[sort] === "string" ? a[sort].toLocaleLowerCase() : a[sort];
//       const propertyB =
//         typeof b[sort] === "string" ? b[sort].toLocaleLowerCase() : b[sort];

//       if (propertyA > propertyB) return 1;
//       if (propertyA < propertyB) return -1;
//       return 0;
//     });

//     return dataCopy;
//   }

//   // passed callback function
//   if (typeof sort === "function") {
//     const sortedData = sort(data);
//     return sortedData;
//   }

//   //if for any reason nothing works - return data with no sorting
//   return data;
// }
