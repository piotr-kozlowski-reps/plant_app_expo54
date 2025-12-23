import {
  LoadingForecastInput,
  Patch_LoadingForecast_DTO,
} from "@/features/shared/types/interfaces-loading_forecast";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import * as yup from "yup";
import { toast } from "sonner-native";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
import { customRegister_LoadingForecast } from "@/features/shared/data-access/customRegister_LoadingForecast";

export const usePrepareDataForFormikToLoadingForecast = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void
) => {
  ////vars
  const { PATCHasyncMutation: send_LoadingForecast_PatchMutation } =
    useGetEdocCustomRegisterMutation({
      customRegister: customRegister_LoadingForecast,
    });
  const { errorHandler } = useErrorHandler();

  //onSubmit
  const onSubmit = async (
    values: LoadingForecastInput,
    formikHelpers: FormikHelpers<LoadingForecastInput>
  ) => {
    const traysQuantity = Number.parseInt(values.traysQuantity.toString());
    const currentZpOutId = values.zpInfo?.outid_;
    const rawValue = values.zpInfo?.scanned_raw_value;

    if (!traysQuantity || !currentZpOutId || !rawValue) {
      toast.error(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    try {
      setIsLoading(true);
      Keyboard.dismiss();

      const dataToBeSent: Patch_LoadingForecast_DTO = {
        idOfPatchedItem: currentZpOutId,
        stkcnt: traysQuantity,
        scanned_raw_value: rawValue,
      };

      await send_LoadingForecast_PatchMutation(dataToBeSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      formikHelpers.resetForm();
      setIsLoading(false);
      resetValues();
    }
  };

  const formikLoadingForecast = useFormik<LoadingForecastInput>({
    initialValues: { traysQuantity: 0, zpInfo: null },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      traysQuantity: yup
        .string()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
        .test("integer", VALIDATION_MESSAGES.MUST_BE_INTEGER, (value: any) => {
          if (value.includes(",")) return false;
          if (value.includes(".")) return false;

          const valueAsNumber = Number.parseInt(value);
          return Number.isInteger(valueAsNumber);
        })
        .test("min 1", VALIDATION_MESSAGES.MIN_VALUE_1, (value: any) => {
          const valueAsNumber = Number.parseInt(value);
          return valueAsNumber >= 1;
        }),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<LoadingForecastInput>(formikLoadingForecast);
  };
  const canFormBeSubmitted =
    formikLoadingForecast.dirty && formikLoadingForecast.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formikLoadingForecast.submitForm
    : () => validateForm();

  return {
    formik: formikLoadingForecast,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
