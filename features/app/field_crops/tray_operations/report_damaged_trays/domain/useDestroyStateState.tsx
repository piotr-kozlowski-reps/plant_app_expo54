import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useState } from "react";

export const useDestroyStateState = () => {
  ////vars
  const { addDaysToDate, createYearMonthDayString } = useDatesHelper();

  //state
  const [selectedDate, setSelectedDate] = useState(
    createYearMonthDayString(addDaysToDate(new Date(Date.now()), 0))
  );
  const [isMine, setIsMine] = useState(true);
  const [isAll, setIsAll] = useState(false);

  //modal
  const [isShowReportDamagedTraysModal, setIsShowReportDamagedTraysModal] =
    useShowModal();

  //side effects
  const chooseIsMine = () => {
    setIsMine(true);
    setIsAll(false);
  };
  const chooseIsAll = () => {
    setIsMine(false);
    setIsAll(true);
  };

  //fn
  const getIsPossibleToGoFurther = () => {
    return (isMine || isAll) && !!selectedDate;
  };

  //hook return
  return {
    selectedDate,
    isMine,
    isAll,
    isShowReportDamagedTraysModal,
    setIsShowReportDamagedTraysModal,
    chooseIsMine,
    setSelectedDate,
    chooseIsAll,
    getIsPossibleToGoFurther,
  };
};
