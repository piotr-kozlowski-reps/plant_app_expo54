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
// import { Keyboard } from "react-native";
import * as yup from "yup";
// import { toast } from "sonner-native";
// import { customRegister_ExtraWork } from "@/features/shared/data-access/customRegister_ExtraWork";

import { PottingInput } from "@/features/shared/types/interfaces-potting";
import { VALIDATION_MESSAGES } from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";

export const usePrepareDataForFormikToPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  //   ////vars
  //   const { POSTasyncMutation: send_ExtraWork_PostMutation } =
  //     useGetEdocCustomRegisterMutation({
  //       customRegister: customRegister_ExtraWork,
  //     });

  //on submit
  const onSubmit = async (
    values: PottingInput,
    formikHelpers: FormikHelpers<PottingInput>,
  ) => {
    //     if (!extraWork) {
    //       toast.error(ERROR_MESSAGES.LACK_OF_EXTRA_WORK);
    //       return;
    //     }
    //     Keyboard.dismiss();
    //     setIsLoading(true);
    //     try {
    //       const dataToBeSent: Post_ExtraWork_QUANTITY_DTO = {
    //         activityid: extraWork.keyval,
    //         begindat: values.donedat,
    //         donedat: new Date(Date.now()),
    //         mobile: true,
    //         qntity: Number.parseInt(values.qntity.toString()),
    //       };
    //       await send_ExtraWork_PostMutation(dataToBeSent);
    //       toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    //     } catch (error) {
    //       toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    //     } finally {
    //       formikHelpers.resetForm();
    //       setIsLoading(false);
    //       closeFn();
    //     }
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
