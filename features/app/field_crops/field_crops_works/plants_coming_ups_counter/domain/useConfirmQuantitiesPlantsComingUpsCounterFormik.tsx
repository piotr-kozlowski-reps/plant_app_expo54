// import { QuantityPerLocalizationInput } from "@/features/shared/types/interface-localization";
// import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import * as yup from "yup";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
// import { ZPLocalizationInfoPlusQuantityToBeMoved } from "@/features/shared/types/interface-zp";

import { Tray } from "@/features/shared/types/interfaces-tray";
import { FormikHelpers, useFormik } from "formik";

export const useConfirmQuantitiesPlantsComingUpsCounterFormik = (
  closeFn: () => void,
  currentTray: Tray,
  addOrChangeQuantityInPlantsComingUpsCounterHandler: (tray: Tray) => void
) => {
  const onSubmit = async (value: Tray, formikHelpers: FormikHelpers<Tray>) => {
    if (!value) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_TRAY);
      return;
    }

    //since it can be number or string, here's a 100% sure it's a number
    const valueLckcntAsNumberForSure = Number.parseInt(String(value.lckcnt));
    addOrChangeQuantityInPlantsComingUpsCounterHandler({
      ...value,
      lckcnt: valueLckcntAsNumberForSure,
    });

    Keyboard.dismiss();
    closeFn();
  };

  const formikConfirmQuantitiesPlantsComingUpsCounter = useFormik<Tray>({
    initialValues: {
      ...currentTray,
      lckcnt: currentTray.lckcnt > 0 ? currentTray.lckcnt : 0,
    },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      lckcnt: yup
        .number()
        .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .min(0, VALIDATION_MESSAGES.MIN_VALUE_0)
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });
  const validateForm = () => {
    validateFormOnDemand<Tray>(formikConfirmQuantitiesPlantsComingUpsCounter);
  };
  const canFormBeSubmitted =
    formikConfirmQuantitiesPlantsComingUpsCounter.isValid;
  const availableFormActions = canFormBeSubmitted
    ? formikConfirmQuantitiesPlantsComingUpsCounter.submitForm
    : () => validateForm();
  return {
    formik: formikConfirmQuantitiesPlantsComingUpsCounter,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
