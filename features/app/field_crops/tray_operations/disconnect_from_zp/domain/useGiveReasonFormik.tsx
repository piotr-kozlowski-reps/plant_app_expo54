import {
  DeleteReason,
  GiveReasonInput,
  TrayScannedValueForDisconnectFromZp,
} from "@/features/shared/types/interfaces-disconnect_from_zp";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import * as yup from "yup";

export const useGiveReasonFormik = (
  chosenTray: TrayScannedValueForDisconnectFromZp | null,
  addOrChangeDeleteReason: (
    tray: TrayScannedValueForDisconnectFromZp,
    reason: DeleteReason
  ) => void,
  closeFn: () => void
) => {
  const onSubmit = async (
    value: GiveReasonInput,
    formikHelpers: FormikHelpers<GiveReasonInput>
  ) => {
    if (
      !value ||
      !value.reason ||
      !value.reason.delete_dscrpt ||
      !value.reason.delete_reason_id ||
      !chosenTray
    ) {
      toast.error(ERROR_MESSAGES.NO_REASON_PROVIDED);
      return;
    }

    addOrChangeDeleteReason(chosenTray, value.reason);
    closeFn();
  };

  const formikGiveReason = useFormik<GiveReasonInput>({
    initialValues: {
      reason: null,
    },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      // quantity: yup
      //   .string()
      //   .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
      //   .test("positive", VALIDATION_MESSAGES.POSITIVE, (value: any) => {
      //     const valueAsNumber =
      //       parseStringToFloatAndReplaceCommaWithDigit(value);
      //     return valueAsNumber > 0;
      //   })
      //   .test(
      //     "is_decimal_with_two_digits",
      //     VALIDATION_MESSAGES.IS_DECIMAL_WITH_MAX_TWO_DIGITS,
      //     (value: any) => {
      //       if (value != undefined) {
      //         const valueAsNumber =
      //           parseStringToFloatAndReplaceCommaWithDigit(value);
      //         return patternTwoDigitsAfterComma.test(
      //           valueAsNumber.toString()
      //         );
      //       }
      //       return false;
      //     }
      //   ),
      // treatment: yup
      //   .object<ProtectiveTreatmentInput>()
      //   .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      // who: yup
      //   .string()
      //   .test(
      //     "is value of WhoDidProtectiveTreatment",
      //     VALIDATION_MESSAGES.NO_GOOD,
      //     (value: any) => {
      //       return value in WhoDidProtectiveTreatmentValues;
      //     }
      //   )
      //   .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      // treatment_type: yup
      //   .object<Combobox<ExtraWork>>()
      //   .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });

  //form helpers
  const validateForm = () => {
    validateFormOnDemand<GiveReasonInput>(formikGiveReason);
  };
  const canFormBeSubmitted = formikGiveReason.isValid && formikGiveReason.dirty;
  const availableFormActions = canFormBeSubmitted
    ? formikGiveReason.submitForm
    : () => validateForm();

  const clearForm = () => {
    formikGiveReason.resetForm();
  };

  //hook return
  return {
    formik: formikGiveReason,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
