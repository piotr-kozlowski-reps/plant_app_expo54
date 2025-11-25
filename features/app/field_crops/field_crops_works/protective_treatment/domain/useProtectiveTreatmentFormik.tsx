import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import { Combobox } from "@/features/shared/types/interfaces-general";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentInput,
  WhoDidProtectiveTreatment,
  WhoDidProtectiveTreatmentValues,
} from "@/features/shared/types/interfaces-protective_treatment";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import * as yup from "yup";
import { Keyboard } from "react-native";

export const useProtectiveTreatmentFormik = (
  setDataForProtectiveTreatment: (
    quantity: number,
    treatment: ProtectiveTreatment,
    treatmentType: ExtraWork,
    who: WhoDidProtectiveTreatment
  ) => void,
  setIsShowScanner: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onSubmit = async (
    value: ProtectiveTreatmentInput,
    formikHelpers: FormikHelpers<ProtectiveTreatmentInput>
  ) => {
    if (
      !value ||
      !value.quantity ||
      !value.treatment ||
      !value.who ||
      !value.treatment_type
    ) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    const quantity: number = parseStringToFloatAndReplaceCommaWithDigit(
      value.quantity
    );
    const treatment: ProtectiveTreatment = value.treatment;
    const treatmentType: ExtraWork = value.treatment_type;
    const who: WhoDidProtectiveTreatment = value.who;

    setDataForProtectiveTreatment(quantity, treatment, treatmentType, who);
    setIsShowScanner(true);

    Keyboard.dismiss();
  };

  let patternTwoDigitsAfterComma = /^\d+(\.\d{0,2})?$/;
  function parseStringToFloatAndReplaceCommaWithDigit(value: any) {
    return Number.parseFloat(value.toString().replace(",", "."));
  }
  const formikProtectiveTreatment = useFormik<ProtectiveTreatmentInput>({
    initialValues: {
      quantity: 0,
      treatment: null,
      who: null,
      treatment_type: null,
    },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      quantity: yup
        .string()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
        .test("positive", VALIDATION_MESSAGES.POSITIVE, (value: any) => {
          const valueAsNumber =
            parseStringToFloatAndReplaceCommaWithDigit(value);
          return valueAsNumber > 0;
        })
        .test(
          "is_decimal_with_two_digits",
          VALIDATION_MESSAGES.IS_DECIMAL_WITH_MAX_TWO_DIGITS,
          (value: any) => {
            if (value != undefined) {
              const valueAsNumber =
                parseStringToFloatAndReplaceCommaWithDigit(value);
              return patternTwoDigitsAfterComma.test(valueAsNumber.toString());
            }
            return false;
          }
        ),
      treatment: yup
        .object<ProtectiveTreatmentInput>()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      who: yup
        .string()
        .test(
          "is value of WhoDidProtectiveTreatment",
          VALIDATION_MESSAGES.NO_GOOD,
          (value: any) => {
            return value in WhoDidProtectiveTreatmentValues;
          }
        )
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      treatment_type: yup
        .object<Combobox<ExtraWork>>()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });

  //form helpers
  const validateForm = () => {
    validateFormOnDemand<ProtectiveTreatmentInput>(formikProtectiveTreatment);
  };
  const canFormBeSubmitted =
    formikProtectiveTreatment.isValid && formikProtectiveTreatment.dirty;
  const availableFormActions = canFormBeSubmitted
    ? formikProtectiveTreatment.submitForm
    : () => validateForm();

  const clearForm = () => {
    formikProtectiveTreatment.resetForm();
  };

  //hook return
  return {
    formik: formikProtectiveTreatment,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
    clearForm,
  };
};
