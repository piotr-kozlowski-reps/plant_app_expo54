import { validateFormOnDemand } from "@/features/shared/utils/validation";
import {
  CotyledonQuilting,
  CotyledonQuiltingQuantityAndCloseColorPostDTO,
  CotyledonQuiltingResponse,
  QuantityForCotyledonQuiltingInput,
} from "@/features/shared/types/interfaces-cotyledon_quilting";
import {
  ERROR_MESSAGES,
  MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { FormikHelpers, useFormik } from "formik";
import { Keyboard } from "react-native";
import * as yup from "yup";
import { toast } from "sonner-native";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import * as Network from "expo-network";
import { router } from "expo-router";

export const usePrepareDataForFormikToCotyledonQuiltingQuantity = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeFn: () => void,
  // trays: TrayShortInfo[],
  chosenColor: CotyledonQuilting | null,
) => {
  ////vars
  const { token } = useAuthSessionStore();

  //on submit
  const onSubmit = async (
    values: QuantityForCotyledonQuiltingInput,
    formikHelpers: FormikHelpers<QuantityForCotyledonQuiltingInput>,
  ) => {
    if (!values || !values.quantity) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_QUANTITY);
      return;
    }

    if (!chosenColor) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_CHOSEN_COLOR);
      return;
    }

    try {
      setIsLoading(true);
      const ip = await Network.getIpAddressAsync();

      const dataToSent: CotyledonQuiltingQuantityAndCloseColorPostDTO[] = [
        {
          ip,
          sordid: chosenColor.sordid,
          ordnmb: chosenColor.ordnmb,
          twr_kod: chosenColor.twr_kod,
          quantity: values.quantity,
          twr_nazwa: chosenColor.twr_nazwa,
          cid: chosenColor.cid,
          mid: chosenColor.mid,
        },
      ];

      await sendToServer(dataToSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS, {
        id: MESSAGES.SEND_DATA_WITH_SUCCESS,
      });
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {
        id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA,
      });
    } finally {
      Keyboard.dismiss();
      formikHelpers.resetForm();
      setIsLoading(false);
      router.push("/app/potted_plants/potted_plants_cotyledon_quilting");
    }
  };

  //helpers
  async function sendToServer(
    dataToBeSend: CotyledonQuiltingQuantityAndCloseColorPostDTO[],
  ) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT, {
        id: ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT,
      });
      return;
    }

    //send data to server
    /**
     * @public
     * @transformApiItem
     * wysyłka ilości liścieni do wybranego koloru w ZP roślin doniczkowych (przy okazji zamknięcie danego koloru) - custom api:
     * <b>{{URL}}</b>/api.php/REST/custom/<b>addquantitymattoorderdon</b>
     * dane - array obiektów:
     * [
     *  {
     *     ip: string;
     *     sordid: number;
     *     ordnmb: string;
     *     twr_kod: string;
     *     twr_nazwa: string;
     *     quantity: number;
     *     cid: number;
     *     mid: number;
     *   }
     * ]
     * @separator
     */
    let response: CotyledonQuiltingResponse =
      await query_postDataAsServerAction<
        CotyledonQuiltingResponse,
        CotyledonQuiltingQuantityAndCloseColorPostDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/addquantitymattoorderdon",
        token!,
        dataToBeSend,
      );

    // console.log(response);

    //check if response array has the same amount of items as sent items
    // const responseIDsQuantity = response.length;
    // const sentItemsQuantity = 1;

    // console.log({ responseIDsQuantity });
    // console.log({ sentItemsQuantity });

    // if (responseIDsQuantity === sentItemsQuantity) {
    //   toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY, {id: MESSAGES.DATA_SENT_SUCCESSFULLY });
    // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUTS_LIST] });
    // closeFn();
    // }
    // if (responseIDsQuantity !== sentItemsQuantity) {
    //   toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA});
    // }
  }

  const formik = useFormik<QuantityForCotyledonQuiltingInput>({
    initialValues: { quantity: 0 },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      quantity: yup
        .number()
        .typeError(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .integer(VALIDATION_MESSAGES.MUST_BE_INTEGER)
        .positive(VALIDATION_MESSAGES.POSITIVE)
        .required(VALIDATION_MESSAGES.FIELD_REQUIRED),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<QuantityForCotyledonQuiltingInput>(formik);
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
