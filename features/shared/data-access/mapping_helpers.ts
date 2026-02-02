import { WorkType } from "../types/interfaces-works_planning";

//string to number or number | null
export function mapStringIntoInteger(value: string): number {
  if (!checkIfStringIsNumeric(value)) {
    throw new Error(
      `mapStringIntoInteger -> value is not a number, but was ${value}`,
    );
  }

  return Number.parseInt(value);
}
export function mapStringOrNullIntoIntegerOrNull(
  value: string | null | undefined,
): number | null {
  if (!value) return null;
  return mapStringIntoInteger(value);
}

export function mapStringIntoFloat(value: string): number {
  if (!checkIfStringIsNumeric(value)) {
    throw new Error(
      `mapStringIntoInteger -> value is not a number, but was ${value}`,
    );
  }

  return Number.parseFloat(value);
}
export function mapStringOrNullIntoFloatOrNull(
  value: string | null | undefined,
): number | null {
  if (!value) return null;
  return mapStringIntoFloat(value);
}

//string to string | mapStringOrNullIntoIntegerOrNull
export function mapStringOrNullIntoStringOrNull(
  value: string | null,
): string | null {
  return !value ? null : value;
}

//string into Date
export function mapStringIntoDate(value: string) {
  if (!checkIsStringValidToCreateADateObject(value))
    throw new Error("mapStringIntoDate -> value cannot be mapped to Date");
  return new Date(value);
}
export function mapStringOrNullIntoDateOrNull(value: string | null) {
  if (!value) return null;
  return mapStringIntoDate(value);
}

/** boolean */
export function mapStringIntoBoolean(value: string): boolean {
  if (value !== "t" && value !== "f") {
    throw new Error(
      "mapStringIntoBoolean -> value is not t or f so it cannot be mapped to boolean",
    );
  }

  return value === "t" ? true : false;
}
export function mapStringOrNullIntoBooleanOrNull(value: string | null) {
  if (!value) return null;
  return mapStringIntoBoolean(value);
}

export function mapStringIntoWorkType(value: string): WorkType {
  if (!value || (value !== "TECH" && value !== "EXTRA")) {
    throw new Error(
      "mapStringIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
    );
  }

  if (value === "EXTRA") return "EXTRA";
  if (value === "TECH") return "TECH";

  throw new Error(
    "mapStringIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
  );
}

//   map(value: string): WorkType {
//     if (value !== "TECH" && value !== "EXTRA") {
//       throw new Error(
//         "MapStringValueIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
//       );
//     }
//     if (value === "EXTRA") return "EXTRA";
//     if (value === "TECH") return "TECH";

//     throw new Error(
//       "MapStringValueIntoWorkType -> value is not TECH or EXTRA so it cannot be mapped to type:  WorkType",
//     );
//   }
// }

////helpers
export const checkIfStringIsNumeric = (num: unknown) =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num as number);

export function checkIsStringValidToCreateADateObject(str: string): boolean {
  const newDateFromString = new Date(str);

  return checkIsDate(newDateFromString);
}
const checkIsDate = (el: unknown): boolean => {
  try {
    const result = !isNaN((el as Date).getTime());
    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};
