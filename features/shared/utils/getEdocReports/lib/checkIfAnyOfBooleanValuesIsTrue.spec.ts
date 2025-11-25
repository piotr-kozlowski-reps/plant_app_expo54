// import { checkIfAnyOfBooleanValuesIsTrue } from "./checkIfAnyOfBooleanValuesIsTrue";
// import { describe, it, vi, expect } from "vitest";

// describe("checkIfAnyOfBooleanValuesIsTrue", () => {
//   it("checkIfAnyOfBooleanValuesIsTrue -> returns true", () => {
//     let boolValuesArray = [true, true, true, true];

//     let result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeTruthy();

//     boolValuesArray = [true];
//     result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeTruthy();

//     boolValuesArray = [true, false, false];
//     result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeTruthy();
//   });

//   it("checkIfAnyOfBooleanValuesIsTrue -> returns false", () => {
//     let boolValuesArray: boolean[] = [];

//     let result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeFalsy();

//     boolValuesArray = [false];
//     result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeFalsy();

//     boolValuesArray = [false, false, false, false, false, false];
//     result = checkIfAnyOfBooleanValuesIsTrue(boolValuesArray);
//     expect(result).toBeFalsy();
//   });
// });
