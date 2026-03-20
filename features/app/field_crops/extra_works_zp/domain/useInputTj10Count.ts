import { useState } from "react";

export const useInputTj10Count = () => {
  /** vars */
  //state
  const [tj12Count, setTj12Count] = useState<number | null>(null);

  //modals
  const [isShowModalWithTj12CountInput, setIsShowModalWithTj12CountInput] =
    useState(false);

  /** functions */
  const changeTj12Quantity = (value: number) => {
    setTj12Count(value);
  };

  return {
    isShowModalWithTj12CountInput,
    tj12Count,

    setIsShowModalWithTj12CountInput,
    changeTj12Quantity,
  };
};
