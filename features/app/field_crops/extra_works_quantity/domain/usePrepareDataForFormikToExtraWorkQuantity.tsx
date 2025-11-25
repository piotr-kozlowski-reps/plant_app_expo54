import { customRegister_ExtraWork } from "@/features/shared/data-access/customRegister_ExtraWork";
import {
  ExtraWork,
  ExtraWorkQuantityInput,
  Post_ExtraWork_QUANTITY_DTO,
} from "@/features/shared/types/interfaces-extra_works";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import * as yup from "yup";
import { toast } from "sonner-native";

export const usePrepareDataForFormikToExtraWorkQuantity = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  extraWork: ExtraWork | undefined,
  closeFn: () => void
) => {
  ////vars
  const { POSTasyncMutation: send_ExtraWork_PostMutation } =
    useGetEdocCustomRegisterMutation({
      customRegister: customRegister_ExtraWork,
    });

  //on submit
  const onSubmit = async (
    values: ExtraWorkQuantityInput,
    formikHelpers: FormikHelpers<ExtraWorkQuantityInput>
  ) => {
    if (!extraWork) {
      toast.error(ERROR_MESSAGES.LACK_OF_EXTRA_WORK);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const dataToBeSent: Post_ExtraWork_QUANTITY_DTO = {
        activityid: extraWork.keyval,
        begindat: values.donedat,
        donedat: new Date(Date.now()),
        mobile: true,
        qntity: Number.parseInt(values.qntity.toString()),
      };

      await send_ExtraWork_PostMutation(dataToBeSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    } catch (error) {
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    } finally {
      formikHelpers.resetForm();
      setIsLoading(false);
      closeFn();
    }
  };

  const formikExtraWorkQuantity = useFormik<ExtraWorkQuantityInput>({
    initialValues: { qntity: 0, donedat: new Date(Date.now()) },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      qntity: yup
        .number()
        .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .min(1, VALIDATION_MESSAGES.MIN_VALUE_1)
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
      donedat: yup
        .date()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
        .test("not_future_date", ERROR_MESSAGES.NO_FUTURE_DATA, (value) => {
          const today = new Date(Date.now());
          return value <= today;
        }),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<ExtraWorkQuantityInput>(formikExtraWorkQuantity);
  };
  const canFormBeSubmitted =
    formikExtraWorkQuantity.dirty && formikExtraWorkQuantity.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formikExtraWorkQuantity.submitForm
    : () => validateForm();

  return {
    formik: formikExtraWorkQuantity,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
