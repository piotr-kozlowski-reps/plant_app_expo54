// import { it, expect, describe } from "vitest";
// import { SortByProperty } from "./SortByProperty";

// type TempType = { id: number; name: string; date: string };

// const tempDataFilled: TempType[] = [
//   { id: 4, name: "b", date: "2024-10-11" },
//   { id: 1, name: "c", date: "2024-10-09" },
//   { id: 3, name: "a", date: "2024-10-20" },
//   { id: 2, name: "d", date: "2024-10-29" },
// ];

// describe("SortByProperty", () => {
//   it("should return sorted array when object property is provided - id", () => {
//     const sortByProperty = new SortByProperty<TempType>("id");

//     expect(sortByProperty.sort(tempDataFilled)).toEqual([
//       { id: 1, name: "c", date: "2024-10-09" },
//       { id: 2, name: "d", date: "2024-10-29" },
//       { id: 3, name: "a", date: "2024-10-20" },
//       { id: 4, name: "b", date: "2024-10-11" },
//     ]);
//   });

//   it("should return sorted array when object property is provided - name", () => {
//     const sortByProperty = new SortByProperty<TempType>("name");

//     expect(sortByProperty.sort(tempDataFilled)).toEqual([
//       { id: 3, name: "a", date: "2024-10-20" },
//       { id: 4, name: "b", date: "2024-10-11" },
//       { id: 1, name: "c", date: "2024-10-09" },
//       { id: 2, name: "d", date: "2024-10-29" },
//     ]);
//   });

//   it("should return sorted array when object property is provided - date", () => {
//     const sortByProperty = new SortByProperty<TempType>("date");

//     expect(sortByProperty.sort(tempDataFilled)).toEqual([
//       { id: 1, name: "c", date: "2024-10-09" },
//       { id: 4, name: "b", date: "2024-10-11" },
//       { id: 3, name: "a", date: "2024-10-20" },
//       { id: 2, name: "d", date: "2024-10-29" },
//     ]);
//   });
// });
