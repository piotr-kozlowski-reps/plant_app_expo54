import { useState } from "react";

export const useInputTjQuantity = () => {
  /** vars */
  //state
  const [tjQuantity, setTjQuantity] = useState<number | null>(null);

  //modals
  const [isShowModalWithTj12CountInput, setIsShowModalWithTj12CountInput] =
    useState(false);

  /** functions */
  const changeTjQuantity = (value: number) => {
    setTjQuantity(value);
  };

  return {
    isShowModalWithTj12CountInput,
    tjQuantity,

    setIsShowModalWithTj12CountInput,
    changeTjQuantity,
  };
};
