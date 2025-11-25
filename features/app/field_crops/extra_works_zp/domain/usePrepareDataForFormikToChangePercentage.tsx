import {
  ZpScannedValue,
  ZpScannedValuePercentage,
} from "@/features/shared/types/interfaces-extra_works";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import * as yup from "yup";

export const usePrepareDataForFormikToChangePercentage = (
  zpItem: ZpScannedValue,
  closeFn: () => void,
  actionFn: (zpValue: ZpScannedValue) => void
) => {
  const onSubmit = async (
    values: ZpScannedValuePercentage,
    formikHelpers: FormikHelpers<ZpScannedValuePercentage>
  ) => {
    if (!zpItem) {
      toast.error(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP);
      return;
    }
    Keyboard.dismiss();

    const zpWithNewValue: ZpScannedValue = {
      ...zpItem,
      act_percentage: values.act_percentage,
    };
    actionFn(zpWithNewValue);
    toast.success(MESSAGES.VALUE_CHANGED_WITH_SUCCESS);
    formikHelpers.resetForm();
    closeFn();
  };

  const formikZpPercentage = useFormik<ZpScannedValuePercentage>({
    initialValues: { act_percentage: zpItem.act_percentage },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      act_percentage: yup
        .number()
        .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .min(1, `Minimalna wartość to 1.`)
        .max(100, VALIDATION_MESSAGES.MAX_VALUE_100)
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<ZpScannedValuePercentage>(formikZpPercentage);
  };
  const canFormBeSubmitted =
    formikZpPercentage.dirty && formikZpPercentage.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formikZpPercentage.submitForm
    : () => validateForm();

  return {
    formik: formikZpPercentage,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
