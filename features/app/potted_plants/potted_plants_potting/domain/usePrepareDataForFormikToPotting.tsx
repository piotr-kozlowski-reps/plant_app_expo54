import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import * as yup from "yup";
import { toast } from "sonner-native";
import { PottingInput } from "@/features/shared/types/interfaces-potting";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { ZPInfoForPotting } from "@/features/shared/types/interfaces-zp";
import { ZpPotActivityConfirmationWithPics_DTO } from "@/features/shared/types/interfaces-activities_list";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useFindMaterialWithDoni } from "./useFindMaterialWithDoni";
import { sendPotsPottingConfirmationWithPicturesToServer } from "@/features/shared/data-access/sendPotsPottingConfirmationWithPicturesToServer";

export const usePrepareDataForFormikToPotting = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  zpInfo: ZPInfoForPotting | null,
  resetValues: () => void,
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();
  const { findMaterialWithDoni } = useFindMaterialWithDoni();

  //on submit
  const onSubmit = async (
    values: PottingInput,
    formikHelpers: FormikHelpers<PottingInput>,
  ) => {
    if (!values || !values.quantity) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_QUANTITY, {
        id: ERROR_MESSAGES.NO_INFO_ABOUT_QUANTITY,
      });
      return;
    }
    if (!zpInfo) {
      toast.error(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP, {
        id: ERROR_MESSAGES.LACK_OF_CHOSEN_ZP,
      });
      return;
    }

    //send data to server
    /**
     * @public
     * @transformApiItem
     * @order 40
     * wysyłka ilości doniczek dla wybranego ZP - custom api:
     * <b>{{URL}}</b>/api.php/REST/custom/<b>czynnoscidone</b>
     * dane - array obiektów:
     * [
     *  {
     *   scanned_raw_value: string;
     *   id: number;
     *   dscrpt: string;
     *   pcz_id: number;
     *   materials: ZpRozActivityMaterial_DTO[];
     *   pictures: CameraCapturedPicture[]
     *   }
     * ]
     * @separator
     * ZpRozActivityMaterial_DTO:
     * {
     *   mat_id: number;
     *   dscrpt: string;
     *   pcm_zrealizowana: number;
     * }
     * @separator
     * CameraCapturedPicture:
     * {
     *    width: number;
     *    height: number;
     *    format: 'jpg' | 'png';
     *    uri: string;
     *    base64?: string;
     *    exif?: Partial<MediaTrackSettings> | any;
     * }
     */

    const foundMaterialWithDoni = findMaterialWithDoni(zpInfo.materials);
    if (!foundMaterialWithDoni) {
      toast.error(
        ERROR_MESSAGES.POTTING_ACTIVITY_MATERIAL_WITH_DONI_NOT_FOUND,
        { id: ERROR_MESSAGES.POTTING_ACTIVITY_MATERIAL_WITH_DONI_NOT_FOUND },
      );
      return;
    }
    // const restOfMaterials = zpInfo.materials.filter(
    //   (material) => material.id !== foundMaterialWithDoni.id,
    // );
    const dataToBeSent: ZpPotActivityConfirmationWithPics_DTO = {
      scanned_raw_value: zpInfo.scannedRawValue,
      id: zpInfo.id,
      dscrpt: zpInfo.dscrpt,
      pcz_id: zpInfo.pcz_id,
      materials: [
        {
          mat_id: foundMaterialWithDoni.id,
          dscrpt: foundMaterialWithDoni.dscrpt,
          pcm_zrealizowana: Number.parseInt(values.quantity.toString()),
        },
      ],
      pictures: [...zpInfo.pictures],
    };

    // console.log({ dataToBeSent });
    // console.log({ zpInfo });

    try {
      setIsLoading(true);
      await sendPotsPottingConfirmationWithPicturesToServer(
        dataToBeSent,
        token!,
      );
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
