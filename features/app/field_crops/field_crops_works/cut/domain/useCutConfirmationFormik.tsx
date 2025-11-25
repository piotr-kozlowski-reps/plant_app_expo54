import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  CutConfirmationInput,
  CutConfirmationResponse,
  Post_CutConfirmation_DTO,
  Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO,
  ZpToCut,
} from "@/features/shared/types/interfaces-cut";
import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "sonner-native";
import * as yup from "yup";
import { Keyboard } from "react-native";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useEffect } from "react";

export const useCutConfirmationFormik = (
  scannedValue: ZPShortenedInfo | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cutsList: ZpToCut[],
  closeFn: () => void,
  refreshAllData: () => void
) => {
  ////vars
  const { user, token } = useAuthSessionStore();
  const queryClient = useQueryClient();
  const { errorHandler } = useErrorHandler();

  ////submit
  async function onSubmit(
    values: CutConfirmationInput,
    formikHelpers: FormikHelpers<CutConfirmationInput>
  ) {
    if (!values || !values.height || !scannedValue || !cutsList) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    const foundZpToCutFromList = cutsList.find(
      (zp) => zp.ordnmb === scannedValue.ordnmb
    );

    try {
      setIsLoading(true);

      //when found ZP on list to cut
      if (foundZpToCutFromList) {
        const dataToSent: Post_CutConfirmation_DTO[] = [
          {
            cutuid: user!.id,
            cutdat: new Date(Date.now()),
            height: values.height,
            id____: foundZpToCutFromList.id____,
            scanned_raw_value: scannedValue.scanned_raw_value,
          },
        ];

        await sendToServer(dataToSent);
      }

      //when not found ZP on list to cut
      if (!foundZpToCutFromList) {
        const dataToSent: Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO[] = [
          {
            cutuid: user!.id,
            ordnmb: scannedValue.ordnmb,
            cutdat: new Date(Date.now()),
            height: values.height,
            scanned_raw_value: scannedValue.scanned_raw_value,
          },
        ];

        await sendToServer(dataToSent);
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      refreshAllData();
      setIsLoading(false);
      Keyboard.dismiss();
      formikHelpers.resetForm();
      closeFn();
    }
  }

  //helpers
  async function sendToServer(
    dataToBeSend:
      | Post_CutConfirmation_DTO[]
      | Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO[]
  ) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: CutConfirmationResponse = await query_postDataAsServerAction<
      CutConfirmationResponse,
      | Post_CutConfirmation_DTO[]
      | Post_CutConfirmation_WhenNotFoundOnLIstToCut_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/cuts",
      token!,
      dataToBeSend
    );

    //check if response array has the same amount of items as sent items
    const responseIDsQuantity = response.length;
    const sentItemsQuantity = 1;

    if (responseIDsQuantity === sentItemsQuantity) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUTS_LIST] });
      closeFn();
    }
    if (responseIDsQuantity !== sentItemsQuantity) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }

  //formik
  const formikCut = useFormik<CutConfirmationInput>({
    initialValues: {
      height: null,
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
    }),
    validateOnMount: true,
  });

  //form helpers
  // function getHeightIfFoundZp(
  //   scannedValue: ZPShortenedInfo | null,
  //   cutsList: ZpToCut[]
  // ): number | null {
  //   if (!scannedValue || !cutsList || !cutsList.length) return null;

  //   const foundZpOnCutsList = cutsList.find(
  //     (zp) => zp.ordnmb === scannedValue.ordnmbś
  //   );
  //   if (!foundZpOnCutsList) return null;

  //   return foundZpOnCutsList.height;
  // }
  const validateForm = () => {
    validateFormOnDemand<CutConfirmationInput>(formikCut);
  };
  const canFormBeSubmitted = formikCut.isValid;
  const availableFormActions = canFormBeSubmitted
    ? formikCut.submitForm
    : () => validateForm();

  const clearForm = () => {
    formikCut.resetForm();
  };

  //change suggested height if found ZP on list to cut
  useEffect(() => {
    if (!scannedValue || !cutsList || !cutsList.length) return;

    const foundZpOnCutsList = cutsList.find(
      (zp) => zp.ordnmb === scannedValue.ordnmb
    );
    if (!foundZpOnCutsList) return;

    formikCut.setFieldValue("height", foundZpOnCutsList.height);
  }, [scannedValue, cutsList]);

  //hook return
  return {
    formik: formikCut,
    canFormBeSubmitted,

    validateForm,
    availableFormActions,
    clearForm,
  };
};
