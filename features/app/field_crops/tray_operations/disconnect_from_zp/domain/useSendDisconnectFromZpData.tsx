import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  DisconnectFromZpResponse,
  Post_DisconnectFromZp_DTO,
  TrayScannedValueForDisconnectFromZp,
} from "@/features/shared/types/interfaces-disconnect_from_zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetErrorsFromControlSowingChangesReport } from "@/features/shared/utils/useGetErrorsFromControlSowingChangesReport";
import { toast } from "sonner-native";

export const useSendDisconnectFromZpData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scannedValues: TrayScannedValueForDisconnectFromZp[],
  resetWholeState: () => void,
) => {
  ////vars
  const { token } = useAuthSessionStore();
  const { getErrorsFromControlSowingChangesReport } =
    useGetErrorsFromControlSowingChangesReport();
  const { errorHandler } = useErrorHandler();

  //fn
  /**
   * @public
   * @transformApiItem
   * @order 80
   * wysyłka - custom api:
   * <b>{{URL}}</b>/api.php/REST/custom/<b>removestktobuffer</b>
   * dane - array obiektów:
   * {
   *        //zp
   *        ordid_: number;
   *        ordnmb: string;
   * @separator
   *        //scanned row value
   *         scannedRawValue: string;
   * @separator
   *         //tray
   *         stk_id: string;
   *         stkid_: number | null;
   *         twrkod: string;
   *         twrnzw: string;
   *         wsk_palet: number | null;
   *         outid_: number | null;
   *         isgarden: string | null;
   *         stkid1: string;
   *         ordid1: string | null;
   *         ordnmb1: string;
   *         movid1: null | number;
   * }
   * @separator
   */
  const sendValuesForDisconnectFromZp = async () => {
    if (!scannedValues || !scannedValues.length) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND, {
        id: ERROR_MESSAGES.NO_INFO_TO_SEND,
      });
      return;
    }

    /** guards */
    /**
     * @public
     * @guard
     * przed wysyłką  - sprawdzam wartośc "errtxt" z raportu 119, jesli jest bład to
     * -> info + koniec procedury
     */
    const allErrors =
      await getErrorsFromControlSowingChangesReport(scannedValues);
    if (allErrors.length) {
      allErrors.forEach((item) => {
        const warningMessage = `Znaleziono błąd w tacy (${item.scannedValue.stk_id}): ${item.errorText}`;
        toast.warning(warningMessage, { id: warningMessage });
      });
      return;
    }

    const dataToSent: Post_DisconnectFromZp_DTO[] = [];
    scannedValues.forEach((item) => {
      dataToSent.push({
        //zp data from zp object
        ordnmb: item.ordnmb,

        //scanned raw
        scanned_raw_value: item.scannedRawValue,

        //tray
        stk_id: item.stk_id,
        stkid1: item.stkid1,
        ordid1: item.ordid1,
        ordnmb1: item.ordnmb1,
        movid1: item.movid1,
        ordid_: item.ordid_,
        stkid_: item.stkid_,
        wsk_palet: item.wsk_palet,
        outid_: item.outid_,
        isgarden: item.isgarden,
      });
    });

    try {
      setIsLoading(true);
      await sendToServer(dataToSent);
    } catch (error) {
      console.error(error);
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  //helpers
  async function sendToServer(dataToBeSend: Post_DisconnectFromZp_DTO[]) {
    if (!dataToBeSend || dataToBeSend.length < 1) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT, {
        id: ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT,
      });
      return;
    }

    //send data to server
    let response: DisconnectFromZpResponse = await query_postDataAsServerAction<
      DisconnectFromZpResponse,
      Post_DisconnectFromZp_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/removestktobuffer",
      token!,
      dataToBeSend,
    );

    //check if response array has the same amount of items as sent items
    // const sentItemsQuantity = dataToBeSend.length;
    const responseIDsQuantity = response.length;
    if (responseIDsQuantity === 0) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY, {
        id: MESSAGES.DATA_SENT_SUCCESSFULLY,
      });
      resetWholeState();
    }
    if (responseIDsQuantity !== 0) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {
        id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA,
      });
    }
  }

  //hook return
  return { sendValuesForDisconnectFromZp };
};
