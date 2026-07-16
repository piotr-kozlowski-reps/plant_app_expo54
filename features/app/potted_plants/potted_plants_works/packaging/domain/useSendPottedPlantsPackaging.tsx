import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  ZPPackagingInfoPostResponse,
  ZPPackagingInfoWithScannedRowValue,
} from "@/features/shared/types/interfaces-zp_packaging";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useToastWrapper } from "@/features/shared/utils/useToastWrapper";

export const useSendPottedPlantsPackaging = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void,
) => {
  const { token } = useAuthSessionStore();
  const { toastWrapper } = useToastWrapper();
  const { errorHandler } = useErrorHandler();

  return async function sendPottedPlantsPackagingHandler(
    value: ZPPackagingInfoWithScannedRowValue | null,
  ) {
    if (!value) {
      toastWrapper(ERROR_MESSAGES.LACK_OF_CHOSEN_ZP, "error");
      return;
    }

    /** send data */
    /**
     * @public
     * @transformApiItem
     * @order 200
     * wysyłka - custom api - POST:
     * adres: <b>{{URL}}</b>/api.php/REST/custom/<b>konfdonedon</b>
     * @separator
     * <b>dane</b>:
     * [
     *     {
     *          cid: number;
     *          prc_id: number;
     *          sordid: number;
     *          ordnmb: string;
     *          pcz_id: number;
     *          ptc_kod: string;
     *          ptc_kod: string;
     *          scanned_raw_value: string;
     *     }
     * ]
     */

    try {
      setIsLoading(true);

      let response: ZPPackagingInfoPostResponse =
        await query_postDataAsServerAction<
          ZPPackagingInfoPostResponse,
          ZPPackagingInfoWithScannedRowValue[]
        >(
          configPerBuild.apiAddress,
          "/api.php/REST/custom/konfdonedon",
          token!,
          [value],
        );

      console.log({ response });

      //check if response array has the same amount of items as sent items
      const responseIDsQuantity = response.length;
      const sentItemsQuantity = 1;
      if (responseIDsQuantity === sentItemsQuantity) {
        toastWrapper(MESSAGES.DATA_SENT_SUCCESSFULLY, "success");
      }
      if (responseIDsQuantity !== sentItemsQuantity) {
        toastWrapper(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, "warning");
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      resetValues();
    }
  };
};
