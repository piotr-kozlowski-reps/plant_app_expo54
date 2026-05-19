import {
  ColorForCotyledonQuiltingInput,
  CotyledonQuilting,
} from "@/features/shared/types/interfaces-cotyledon_quilting";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import * as yup from "yup";

export const useChooseColorForCotyledonQuiltingFormik = (
  setChosenColor: React.Dispatch<
    React.SetStateAction<CotyledonQuilting | null>
  >,
  setIsShowAddingTraysModal: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const onSubmit = async (
    value: ColorForCotyledonQuiltingInput,
    formikHelpers: FormikHelpers<ColorForCotyledonQuiltingInput>,
  ) => {
    if (!value || !value.colorTray) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    setChosenColor(value.colorTray);
    setIsShowAddingTraysModal(true);
  };

  const formikProtectiveTreatment = useFormik<ColorForCotyledonQuiltingInput>({
    initialValues: {
      colorTray: null,
    },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      colorTray: yup
        .object<CotyledonQuilting>({
          sordid: yup.number().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
          ordnmb: yup.string().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
          open: yup.boolean().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
          pcm_ilosc: yup.string().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
          twr_kod: yup.string().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
          twr_nazwa: yup.string().required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
        })
        .required(VALIDATION_MESSAGES.CHOICE_REQUIRED),
    }),
  });

  //form helpers
  const validateForm = () => {
    validateFormOnDemand<ColorForCotyledonQuiltingInput>(
      formikProtectiveTreatment,
    );
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
