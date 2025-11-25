export class MapHelpers {
  public static checkIfStringIsNumeric = (num: any) =>
    (typeof num === "number" ||
      (typeof num === "string" && num.trim() !== "")) &&
    !isNaN(num as number);

  public static checkIsStringValidToCreateADateObject(str: string): boolean {
    if (!str) return false;
    const newDateFromString = new Date(str);
    return MapHelpers.checkIsDate(newDateFromString);
  }

  public static checkIsDate = (el: any): boolean => {
    if (!el) return false;
    try {
      const result = !isNaN((el as Date).getTime());
      return result;
    } catch (error) {
      return false;
    }
  };
}
