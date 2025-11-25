// import { checkIfIsLoadingOrFetchingAndSetGlobalState } from "./checkIfIsLoadingOrFetchingAndSetGlobalState";
// import { describe, it, vi, expect } from "vitest";

// describe("checkIfIsLoadingOrFetchingAndSetGlobalState", () => {
//   it("checkIfIsLoadingOrFetchingAndSetGlobalState -> fn called with true", () => {
//     // let boolValuesArray = [true, true, true, true];
//     const boolValuesArray = new Map<string, boolean[]>();
//     boolValuesArray.set("dsfvdfgv", [true, true]);
//     boolValuesArray.set("dsfvdfg4", [true, true]);
//     const fn = vi.fn();

//     checkIfIsLoadingOrFetchingAndSetGlobalState(boolValuesArray, fn);
//     expect(fn).toHaveBeenCalledWith(true);

//     const fn2 = vi.fn();
//     const boolValuesArray2 = new Map<string, boolean[]>();
//     boolValuesArray2.set("dsfvdfgv", [false, false]);
//     boolValuesArray2.set("dsfvdfg4", [false, true]);
//     checkIfIsLoadingOrFetchingAndSetGlobalState(boolValuesArray2, fn2);
//     expect(fn2).toHaveBeenCalledWith(true);
//   });

//   it("checkIfIsLoadingOrFetchingAndSetGlobalState -> fn called with false", () => {
//     let boolValuesArray = new Map<string, boolean[]>();
//     const fn = vi.fn();

//     checkIfIsLoadingOrFetchingAndSetGlobalState(boolValuesArray, fn);
//     expect(fn).toHaveBeenCalledWith(false);

//     const fn2 = vi.fn();
//     let boolValuesArray2 = new Map<string, boolean[]>();
//     boolValuesArray2.set("dsfvdfgv", [false, false]);
//     boolValuesArray2.set("dsfvdfg4", [false, false]);
//     checkIfIsLoadingOrFetchingAndSetGlobalState(boolValuesArray2, fn2);
//     expect(fn2).toHaveBeenCalledWith(false);
//   });
// });
