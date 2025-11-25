// import { it, expect, describe } from "vitest";
// import { MapHelpers } from "./mapHelpers";

// describe("checkIfStringIsNumeric", () => {
//   it("should return true when checking if numeric string is valid", () => {
//     const numericString = "123";
//     const result = MapHelpers.checkIfStringIsNumeric(numericString);
//     expect(result).toBe(true);
//   });

//   it("should return false when checking if empty string is numeric", () => {
//     const emptyString = "";
//     const result = MapHelpers.checkIfStringIsNumeric(emptyString);
//     expect(result).toBe(false);
//   });

//   it("should return true when input is a valid number", () => {
//     expect(MapHelpers.checkIfStringIsNumeric(123)).toBe(true);
//     expect(MapHelpers.checkIfStringIsNumeric("456")).toBe(true);
//     expect(MapHelpers.checkIfStringIsNumeric(" 789 ")).toBe(true);
//   });

//   it("should return false when input is non number text", () => {
//     expect(MapHelpers.checkIfStringIsNumeric("ercrf")).toBe(false);
//     expect(MapHelpers.checkIfStringIsNumeric("23423w")).toBe(false);
//     expect(MapHelpers.checkIfStringIsNumeric(" 7D89 ")).toBe(false);
//   });
// });

// describe("checkIsStringValidToCreateADateObject", () => {
//   it("should return true when given a valid date string", () => {
//     const validDateString = "2023-12-25";

//     const result =
//       MapHelpers.checkIsStringValidToCreateADateObject(validDateString);

//     expect(result).toBe(true);
//   });

//   it("should return true when given a date string with timezone", () => {
//     const result = MapHelpers.checkIsStringValidToCreateADateObject(
//       "2023-10-01T00:00:00Z"
//     );
//     expect(result).toBe(true);
//   });

//   it("should return true when given a date string with time", () => {
//     const result = MapHelpers.checkIsStringValidToCreateADateObject(
//       "2023-10-01T12:00:00"
//     );
//     expect(result).toBe(true);
//   });

//   it("should return false when given bad string date", () => {
//     expect(
//       MapHelpers.checkIsStringValidToCreateADateObject("2023-sdfcvfdv")
//     ).toBe(false);

//     expect(MapHelpers.checkIsStringValidToCreateADateObject(null as any)).toBe(
//       false
//     );

//     expect(MapHelpers.checkIsStringValidToCreateADateObject("")).toBe(false);

//     expect(MapHelpers.checkIsStringValidToCreateADateObject("2023-24-51")).toBe(
//       false
//     );
//   });
// });

// describe("checkIsDate", () => {
//   it("should return true when given a valid date string", () => {
//     const validDateString = "2023-12-25";

//     const result =
//       MapHelpers.checkIsStringValidToCreateADateObject(validDateString);

//     expect(result).toBe(true);
//   });

// });
