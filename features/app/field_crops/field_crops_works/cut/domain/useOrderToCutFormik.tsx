import { customRegister_OrderToCutGRU } from "@/features/shared/data-access/customRegister_OrderToCutGRU";
import {
  CutInput,
  Post_OrderToCutGRU_DTO,
} from "@/features/shared/types/interfaces-cut";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import { toast } from "sonner-native";
import * as yup from "yup";

export const useOrderToCutFormik = (
  closeFn: () => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scannedValue: ZPShortenedInfo | null,
  refreshAllData: () => void
) => {
  const { addDaysToDate, checkIsDate, getIfIsTodayOrTomorrow } =
    useDatesHelper();
  const { POSTasyncMutation: send_OrderToCut_PostMutation } =
    useGetEdocCustomRegisterMutation({
      customRegister: customRegister_OrderToCutGRU,
    });

  async function onSubmit(
    values: CutInput,
    formikHelpers: FormikHelpers<CutInput>
  ) {
    if (!values || !values.plannedDate || !values.height || !scannedValue) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    /** guard - cannot send order for today or tomorrow when is after 13:00 */
    const isTodayOrTomorrow = getIfIsTodayOrTomorrow(values.plannedDate);
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (isTodayOrTomorrow && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    const dataToBeSent: Post_OrderToCutGRU_DTO = {
      sordid: scannedValue.sordid,
      ordnmb: scannedValue.ordnmb,
      plndat: values.plannedDate,
      height: values.height,
      stkcnt: scannedValue.stkcnt,
      scanned_raw_value: scannedValue.scanned_raw_value,
    };

    try {
      setIsLoading(true);
      await send_OrderToCut_PostMutation(dataToBeSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    } catch (error) {
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    } finally {
      refreshAllData();
      setIsLoading(false);
      Keyboard.dismiss();
      closeFn();
    }
  }

  const formikCut = useFormik<CutInput>({
    initialValues: {
      height: 6,
      plannedDate: addDaysToDate(new Date(Date.now()), 1),
    },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      height: yup
        .string()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
        .test("min 6", VALIDATION_MESSAGES.MIN_VALUE_6, (value: any) => {
          const valueAsNumber = Number.parseInt(value);
          return valueAsNumber >= 6;
        })
        .test("max 13", VALIDATION_MESSAGES.MAX_VALUE_13, (value: any) => {
          if (value != undefined) {
            const valueAsNumber = Number.parseInt(value);
            return valueAsNumber <= 13;
          }
          return false;
        }),
      plannedDate: yup
        .date()
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED)
        .test(
          "cannot order today or tomorrow after 13",
          ERROR_MESSAGES.CANNOT_ORDER_AFTER_13,
          (value: any) => {
            if (!value || !checkIsDate(value)) return false;

            const valueAsDate = new Date(value);
            const isTodayOrTomorrow = getIfIsTodayOrTomorrow(valueAsDate);
            const isPossibleToProcess_Before13 =
              getIsPossibleToProcess_After13_guard();

            return isTodayOrTomorrow && !isPossibleToProcess_Before13
              ? false
              : true;
          }
        ),
    }),
    validateOnMount: true,
  });

  //form helpers

  const validateForm = () => {
    validateFormOnDemand<CutInput>(formikCut);
  };
  const canFormBeSubmitted = formikCut.isValid;
  const availableFormActions = canFormBeSubmitted
    ? formikCut.submitForm
    : () => validateForm();

  const clearForm = () => {
    formikCut.resetForm();
  };

  //hook return
  return {
    formik: formikCut,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
    clearForm,
  };
};
