import { ExtraWorkTj12QuantityInput } from "@/features/shared/types/interfaces-extra_works";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import { Keyboard } from "react-native";
import * as yup from "yup";

type Input = ExtraWorkTj12QuantityInput;

export const usePrepareDataForFormikToTj12Quantity = (
  changeTj12Quantity: (value: number) => void,
  closeFn: () => void,
  tj12Count: number | null,
) => {
  //on submit
  const onSubmit = async (
    values: Input,
    formikHelpers: FormikHelpers<Input>,
  ) => {
    if (!values.quantity) {
      toast.error(ERROR_MESSAGES.LACK_OF_TJ12_QUANTITY);
      return;
    }
    Keyboard.dismiss();
    changeTj12Quantity(values.quantity);
    formikHelpers.resetForm();
    closeFn();
  };

  const formikTj12Quantity = useFormik<Input>({
    initialValues: tj12Count ? { quantity: tj12Count } : { quantity: 0 },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      quantity: yup
        .number()
        .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .min(1, VALIDATION_MESSAGES.MIN_VALUE_1)
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<Input>(formikTj12Quantity);
  };
  const canFormBeSubmitted =
    formikTj12Quantity.dirty && formikTj12Quantity.isValid;
  const availableFormActions = canFormBeSubmitted
    ? formikTj12Quantity.submitForm
    : () => validateForm();
  return {
    formik: formikTj12Quantity,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
