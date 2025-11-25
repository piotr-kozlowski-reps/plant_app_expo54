import {
  QuantityActionsConfirmation,
  ZpRozActivityDetails,
} from "@/features/shared/types/interfaces-activities_list";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import * as yup from "yup";
import { Keyboard } from "react-native";

export const useQuantityActionsConfirmationFormik = (
  activityDetails: ZpRozActivityDetails | null,
  updateQuantity: (id: number, newQuantity: number) => void,
  closeFn: () => void
) => {
  async function onSubmit(
    values: QuantityActionsConfirmation,
    formikHelpers: FormikHelpers<QuantityActionsConfirmation>
  ) {
    if (!values || !values.height || !activityDetails) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    updateQuantity(activityDetails.id, values.height);
    Keyboard.dismiss();
    formikHelpers.resetForm();
    closeFn();
  }

  const initialValue = activityDetails?.iledne
    ? activityDetails.iledne
    : activityDetails?.ilebeg
    ? activityDetails.ilebeg
    : 0;
  const formikQuantityActionsConfirmation =
    useFormik<QuantityActionsConfirmation>({
      initialValues: {
        height: initialValue,
      },
      onSubmit: onSubmit,
      validationSchema: yup.object({
        height: yup
          .string()
          .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
          .test("min 0", VALIDATION_MESSAGES.MIN_VALUE_0, (value: any) => {
            const valueAsNumber = Number.parseInt(value);
            return valueAsNumber >= 0;
          })
          .test(
            "max integer",
            VALIDATION_MESSAGES.MAX_VALUE_INTEGER,
            (value: any) => {
              if (value != undefined) {
                const valueAsNumber = Number.parseInt(value);
                return valueAsNumber <= Number.MAX_SAFE_INTEGER;
              }
              return false;
            }
          ),
      }),
      // validateOnMount: true,
    });

  //form helpers
  const validateForm = () => {
    validateFormOnDemand<QuantityActionsConfirmation>(
      formikQuantityActionsConfirmation
    );
  };
  const canFormBeSubmitted =
    formikQuantityActionsConfirmation.isValid &&
    formikQuantityActionsConfirmation.dirty;
  const availableFormActions = canFormBeSubmitted
    ? formikQuantityActionsConfirmation.submitForm
    : () => validateForm();

  const clearForm = () => {
    formikQuantityActionsConfirmation.resetForm();
  };

  //hook return
  return {
    formik: formikQuantityActionsConfirmation,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
    clearForm,
  };
};
