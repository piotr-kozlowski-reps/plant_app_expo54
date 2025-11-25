import { useEffect, useState } from "react";

export const useChoosingLogicForWateringPlants = () => {
  ////vars

  ////state
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [all, setAll] = useState(true);
  const [isSendingAvailable, setIsSendingAvailable] = useState(false);

  //side effects
  useEffect(() => {
    if (a || b || c || all) {
      setIsSendingAvailable(true);
    } else {
      setIsSendingAvailable(false);
    }
  }, [a, b, c, all]);

  //fn
  const setChosenValue = (value: boolean, type: "a" | "b" | "c" | "all") => {
    switch (type) {
      case "a":
        if (all) setAll(false);
        setA(value);
        break;
      case "b":
        if (all) setAll(false);
        setB(value);
        break;
      case "c":
        if (all) setAll(false);
        setC(value);
        break;
      case "all":
        setA(false);
        setB(false);
        setC(false);
        setAll(value);
        break;
    }
  };

  ////hook return
  return { a, b, c, all, isSendingAvailable, setChosenValue };
};
