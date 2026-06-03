// import {
//   ExtraWork,
//   ExtraWorkQuantityInput,
//   Post_ExtraWork_QUANTITY_DTO,
// } from "@/features/shared/types/interfaces-extra_works";
// import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
// import {
//   ERROR_MESSAGES,
//   MESSAGES,
//   VALIDATION_MESSAGES,
// } from "@/features/shared/utils/messages";
// import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import * as yup from "yup";
import { toast } from "sonner-native";
// import { customRegister_ExtraWork } from "@/features/shared/data-access/customRegister_ExtraWork";

import { PottingInput } from "@/features/shared/types/interfaces-potting";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { ZPInfoForPotting } from "@/features/shared/types/interfaces-zp";
import { useSendActivityConfirmation } from "@/features/app/greenhouse_crops/greenhouse_crops_works/actions_confirmation/domain/useSendActivityConfirmation";
import { ZpRozActivityConfirmation_DTO } from "@/features/shared/types/interfaces-activities_list";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { sendActivityConfirmationToServer } from "@/features/shared/data-access/sendActivityConfirmationToServer";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

export const usePrepareDataForFormikToPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  zpInfo: ZPInfoForPotting | null,
  resetValues: () => void,
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  //on submit
  const onSubmit = async (
    values: PottingInput,
    formikHelpers: FormikHelpers<PottingInput>,
  ) => {
    if (!values || !values.quantity) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_QUANTITY);
      return;
    }
    if (!zpInfo) {
      toast.error(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP);
      return;
    }

    const dataToBeSent: ZpRozActivityConfirmation_DTO = {
      scanned_raw_value: zpInfo.scannedRawValue,
      id: zpInfo.id,
      dscrpt: zpInfo.dscrpt,
      pcz_id: zpInfo.pcz_id,
      materials: [
        {
          mat_id: zpInfo.material.id,
          dscrpt: zpInfo.material.dscrpt,
          pcm_zrealizowana: Number.parseInt(values.quantity.toString()),
        },
      ],
    };

    try {
      setIsLoading(true);
      await sendActivityConfirmationToServer(dataToBeSent, token!);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      Keyboard.dismiss();
      formikHelpers.resetForm();
      resetValues();
    }
  };

  const formik = useFormik<PottingInput>({
    initialValues: { quantity: 0 },
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
    validateFormOnDemand<PottingInput>(formik);
  };
  const canFormBeSubmitted = formik.dirty && formik.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formik.submitForm
    : () => validateForm();

  return {
    formik,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
