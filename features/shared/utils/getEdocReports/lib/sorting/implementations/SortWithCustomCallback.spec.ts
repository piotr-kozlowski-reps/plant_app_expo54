// import { it, expect, describe } from "vitest";
// import { SortWithCustomCallback } from "./SortWithCustomCallback";

// type TempType = { id: number; name: string; date: string };
// const tempDataFilled: TempType[] = [
//   { id: 4, name: "b", date: "2024-10-11" },
//   { id: 1, name: "c", date: "2024-10-09" },
//   { id: 3, name: "a", date: "2024-10-20" },
//   { id: 2, name: "d", date: "2024-10-29" },
// ];

// describe("SortWithCustomCallback", () => {
//   it("should return sorted array when custom callbackFn is provided - date", () => {
//     const callback = (dataArray: TempType[]): TempType[] => {
//       const dataArrayCopy = [...dataArray];
//       dataArrayCopy.sort((a: TempType, b: TempType): number => {
//         if (a.name > b.name) return 1;
//         if (a.name < b.name) return -1;
//         return 0;
//       });

//       return dataArrayCopy;
//     };

//     const sortWithCustomCallback = new SortWithCustomCallback<TempType>(
//       callback
//     );

//     expect(sortWithCustomCallback.sort(tempDataFilled)).toEqual([
//       { id: 3, name: "a", date: "2024-10-20" },
//       { id: 4, name: "b", date: "2024-10-11" },
//       { id: 1, name: "c", date: "2024-10-09" },
//       { id: 2, name: "d", date: "2024-10-29" },
//     ]);
//   });
// });
