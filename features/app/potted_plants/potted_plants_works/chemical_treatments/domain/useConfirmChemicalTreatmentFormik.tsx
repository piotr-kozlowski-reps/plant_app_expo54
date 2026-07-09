import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentInput,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { parseStringToFloatAndReplaceCommaWithDigit } from "@/features/shared/utils/utils_number";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import { Keyboard } from "react-native";
import {
  initialValuesProtectiveTreatment,
  validationSchemaProtectiveTreatment,
} from "@/features/app/field_crops/field_crops_works/protective_treatment/domain/useProtectiveTreatmentFormik";
import { validateFormOnDemand } from "@/features/shared/utils/validation";

export const useConfirmChemicalTreatmentFormik = (
  setDataForProtectiveTreatment: (
    quantity: number,
    treatment: ProtectiveTreatment,
    treatmentType: ExtraWork,
    who: WhoDidProtectiveTreatment,
  ) => void,
  setIsShowScanner: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const onSubmit = async (
    value: ProtectiveTreatmentInput,
    formikHelpers: FormikHelpers<ProtectiveTreatmentInput>,
  ) => {
    if (
      !value ||
      !value.quantity ||
      !value.treatment ||
      !value.who ||
      !value.treatment_type
    ) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND, {
        id: ERROR_MESSAGES.NO_INFO_TO_SEND,
      });
      return;
    }

    const quantity: number = parseStringToFloatAndReplaceCommaWithDigit(
      value.quantity,
    );
    const treatment: ProtectiveTreatment = value.treatment;
    const treatmentType: ExtraWork = value.treatment_type;
    const who: WhoDidProtectiveTreatment = value.who;

    setDataForProtectiveTreatment(quantity, treatment, treatmentType, who);
    setIsShowScanner(true);

    Keyboard.dismiss();
  };

  const formik = useFormik<ProtectiveTreatmentInput>({
    initialValues: initialValuesProtectiveTreatment,
    onSubmit: onSubmit,
    validationSchema: validationSchemaProtectiveTreatment,
  });

  //form helpers
  const validateForm = () => {
    validateFormOnDemand<ProtectiveTreatmentInput>(formik);
  };
  const canFormBeSubmitted = formik.isValid && formik.dirty;
  const availableFormActions = canFormBeSubmitted
    ? formik.submitForm
    : () => validateForm();

  const clearForm = () => {
    formik.resetForm();
  };

  //hook return
  return {
    formik,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
    clearForm,
  };
};
