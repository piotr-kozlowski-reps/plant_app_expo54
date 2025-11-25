import { Combobox } from "@/features/shared/types/interfaces-general";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";

export const useGetComboboxItems = () => {
  ////vars
  const { renderDateInPolishWay, addDaysToDate, getDayNameInPolish } =
    useDatesHelper();

  ////values
  const comboboxCutHeights: Combobox<number>[] = [
    { visibleText: "6 mm", value: 6 },
    { visibleText: "7 mm", value: 7 },
    { visibleText: "8 mm", value: 8 },
    { visibleText: "9 mm", value: 9 },
    { visibleText: "10 mm", value: 10 },
    { visibleText: "11 mm", value: 11 },
    { visibleText: "12 mm", value: 12 },
    { visibleText: "13 mm", value: 13 },
  ];

  const getProperLabelForDate = (date: Date): string => {
    return `${renderDateInPolishWay(date)} - ${getDayNameInPolish(date)}`;
  };
  const comboboxCutDates: Combobox<Date>[] = [
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 1)
      ),
      value: addDaysToDate(new Date(Date.now()), 1),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 2)
      ),
      value: addDaysToDate(new Date(Date.now()), 2),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 3)
      ),
      value: addDaysToDate(new Date(Date.now()), 3),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 4)
      ),
      value: addDaysToDate(new Date(Date.now()), 4),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 5)
      ),
      value: addDaysToDate(new Date(Date.now()), 5),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 6)
      ),
      value: addDaysToDate(new Date(Date.now()), 6),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 7)
      ),
      value: addDaysToDate(new Date(Date.now()), 7),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 8)
      ),
      value: addDaysToDate(new Date(Date.now()), 8),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 9)
      ),
      value: addDaysToDate(new Date(Date.now()), 9),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 10)
      ),
      value: addDaysToDate(new Date(Date.now()), 10),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 11)
      ),
      value: addDaysToDate(new Date(Date.now()), 11),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 12)
      ),
      value: addDaysToDate(new Date(Date.now()), 12),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 13)
      ),
      value: addDaysToDate(new Date(Date.now()), 13),
    },
    {
      visibleText: getProperLabelForDate(
        addDaysToDate(new Date(Date.now()), 14)
      ),
      value: addDaysToDate(new Date(Date.now()), 14),
    },
  ];

  return { comboboxCutHeights, comboboxCutDates };
};
