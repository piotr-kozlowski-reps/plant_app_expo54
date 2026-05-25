import { CotyledonQuilting } from "@/features/shared/types/interfaces-cotyledon_quilting";
import { useEffect, useState } from "react";
import { useChooseColorForCotyledonQuiltingFormik } from "./useChooseColorForCotyledonQuiltingFormik";

export const useHandleChosenColor = () => {
  const [chosenColor, setChosenColor] = useState<CotyledonQuilting | null>(
    null,
  );

  const { formik } = useChooseColorForCotyledonQuiltingFormik();
  const currentColorInFormik = formik.values.colorTray;
  useEffect(() => {
    if (currentColorInFormik) setChosenColor(currentColorInFormik);
  }, [currentColorInFormik]);

  ////hook return
  return { chosenColor, formik };
};
