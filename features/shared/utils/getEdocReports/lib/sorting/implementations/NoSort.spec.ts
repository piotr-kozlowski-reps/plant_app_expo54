// import { it, expect, describe } from "vitest";
// import { NoSort } from "./NoSort";

// describe("NoSort", () => {
//   it("should return array in same order as input array", () => {
//     const noSort = new NoSort<number>();
//     const input = [3, 1, 4, 1, 5];
//     const result = noSort.sort(input);
//     expect(result).toEqual([3, 1, 4, 1, 5]);
//   });

//   it("should return empty array when input is empty", () => {
//     const noSort = new NoSort<number>();
//     const input: number[] = [];
//     const result = noSort.sort(input);
//     expect(result).toEqual([]);
//   });

//   it("should return the same array when given a non-empty array of strings", () => {
//     const noSort = new NoSort<string>();
//     const data = ["apple", "banana", "cherry"];
//     const result = noSort.sort(data);
//     expect(result).toEqual(data);
//   });
// });
