export const useDatesHelper = () => {
  const addDaysToDate = (date: Date, days: number): Date => {
    return new Date(date.setTime(864e5 * days + date.valueOf()));
  };

  const getDayNameInPolish = (date: Date): string => {
    return date.toLocaleDateString("pl-PL", { weekday: "long" });
  };

  const renderDateInPolishWay = (date: Date | null) => {
    if (!date) return "(brak informacji)";
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    });
  };

  const getIsDayAvailableToOrderExportToClient = (date: Date): boolean => {
    const isFridaySaturdayOrSunday =
      date.getDay() === 0 || date.getDay() === 5 || date.getDay() === 6;
    return isFridaySaturdayOrSunday ? false : true;
  };

  const checkIsDate = (value: any) =>
    value instanceof Date && !isNaN(value as any);

  const createYearMonthDayString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getIfIsTodayOrTomorrow = (date: Date): boolean => {
    const now = new Date(Date.now());
    const tomorrowsDate = addDaysToDate(new Date(Date.now()), 1);

    const isValueToday = date.toDateString() === now.toDateString();
    const isValueTomorrow =
      date.toDateString() === tomorrowsDate.toDateString();

    return isValueToday || isValueTomorrow;
  };

  return {
    addDaysToDate,
    getDayNameInPolish,
    renderDateInPolishWay,
    getIsDayAvailableToOrderExportToClient,
    checkIsDate,
    createYearMonthDayString,
    getIfIsTodayOrTomorrow,
  };
};
