import { QuantityPerLocalizationInput } from "@/features/shared/types/interfaces-localization";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import * as yup from "yup";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { ZPLocalizationInfoPlusQuantityToBeMoved } from "@/features/shared/types/interfaces-zp";

export const useZpInternalTransportQuantityFormik = (
  closeFn: () => void,
  passedQuantity: number,
  localization: ZPLocalizationInfoPlusQuantityToBeMoved | null,
  changeQuantityHandler: (
    localizationWithNewQuantity: ZPLocalizationInfoPlusQuantityToBeMoved
  ) => void
) => {
  const onSubmit = async (
    values: QuantityPerLocalizationInput,
    formikHelpers: FormikHelpers<QuantityPerLocalizationInput>
  ) => {
    if (!values || !localization) {
      toast.success(ERROR_MESSAGES.NO_INFO_ABOUT_LOCALIZATION);
      return;
    }

    changeQuantityHandler({
      ...localization,
      quantity_to_be_moved: Number.parseInt(values.qntity as unknown as string),
    });

    toast.success(MESSAGES.VALUE_CHANGED_WITH_SUCCESS);
    Keyboard.dismiss();
    closeFn();
  };

  const formikInternalTransportQuantity =
    useFormik<QuantityPerLocalizationInput>({
      initialValues: { qntity: passedQuantity },
      onSubmit: onSubmit,
      validationSchema: yup.object({
        qntity: yup
          .number()
          .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
          .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
          .min(0, VALIDATION_MESSAGES.MIN_VALUE_0)
          .max(passedQuantity, VALIDATION_MESSAGES.MAX_VALUE_EXCEEDED)
          .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      }),
    });

  const validateForm = () => {
    validateFormOnDemand<QuantityPerLocalizationInput>(
      formikInternalTransportQuantity
    );
  };
  const canFormBeSubmitted = formikInternalTransportQuantity.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formikInternalTransportQuantity.submitForm
    : () => validateForm();

  return {
    formik: formikInternalTransportQuantity,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
