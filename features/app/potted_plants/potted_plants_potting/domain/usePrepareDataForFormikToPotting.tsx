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

export const usePrepareDataForFormikToPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  zpInfo: ZPInfoForPotting | null,
  resetValues: () => void,
) => {
  ////vars
  const { sendActivityConfirmationHandler } = useSendActivityConfirmation(
    resetValues,
    setIsLoading,
  );
  //   const { POSTasyncMutation: send_ExtraWork_PostMutation } =
  //     useGetEdocCustomRegisterMutation({
  //       customRegister: customRegister_ExtraWork,
  //     });

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

    // const dataToBeSent: ZpRozActivityConfirmation_DTO = {
    //   scanned_raw_value: zpInfo.scannedRawValue,
    //   id: zpInfo.id,
    //   dscrpt: zpInfo.dscrpt,
    //   pcz_id: zpInfo.pcz_id,
    //   materials: [{
    //     mat_id: zpInfo.material.id,
    //     dscrpt: zpInfo.materials[0].dscrpt,
    //     pcm_zrealizowana: Number.parseInt(values.quantity.toString()),
    //   }]

    //     zpInfo.materials.map((material) => ({
    //     mat_id: material.id,
    //     dscrpt: material.dscrpt,
    //     pcm_zrealizowana: material.iledne,
    //   })),
    // };

    Keyboard.dismiss();

    // await sendActivityConfirmationHandler(
    //   zpInfo,
    //   [zpInfo.materials],
    //   zpInfo.scannedRawValue,
    // );

    // setIsLoading(true);
    // try {
    //   //       const dataToBeSent: Post_ExtraWork_QUANTITY_DTO = {
    //   //         activityid: extraWork.keyval,
    //   //         begindat: values.donedat,
    //   //         donedat: new Date(Date.now()),
    //   //         mobile: true,
    //   //         qntity: Number.parseInt(values.qntity.toString()),
    //   //       };
    //   //       await send_ExtraWork_PostMutation(dataToBeSent);
    //   //       toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    //   //     } catch (error) {
    //   //       toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    // } finally {
    //   formikHelpers.resetForm();
    //   setIsLoading(false);
    //   resetValues();
    // }
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
