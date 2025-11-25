import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  AddToZpResponse,
  Post_AddToZp_DTO,
  TrayScannedValueForAddToZp,
  ZpScannedValueForAddToZp,
} from "@/features/shared/types/interface-add_to_zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetErrorsFromControlSowingChangesReport } from "@/features/shared/utils/useGetErrorsFromControlSowingChangesReport";
import { toast } from "sonner-native";

export const useSendAddToZpData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetWholeState: () => void
) => {
  ////vars
  const { getErrorsFromControlSowingChangesReport } =
    useGetErrorsFromControlSowingChangesReport();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  ////fn
  async function sendValuesForAddToZp(
    zp: ZpScannedValueForAddToZp | null,
    scannedTrays: TrayScannedValueForAddToZp[]
  ) {
    if (!zp || !scannedTrays || !scannedTrays.length) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    try {
      /** guards */
      //check errtxt from report 119
      const allErrors = await getErrorsFromControlSowingChangesReport(
        scannedTrays
      );
      if (allErrors.length) {
        allErrors.forEach((item) => {
          toast.warning(
            `Znaleziono błąd w tacy (${item.scannedValue.stk_id}): ${item.errorText}`
          );
        });
        return;
      }

      const dataToSent: Post_AddToZp_DTO[] = [];
      scannedTrays.forEach((item) => {
        dataToSent.push({
          //zp data from zp object
          ordnmb: zp.ordnmb,
          sordid: zp.sordid,
          ordid_: zp.sordid,

          //scanned raw value
          scanned_raw_value: `zp_scanned_raw_value: ${zp.scannedRawValue}, tray_scanned_raw_value: ${item.scannedRawValue}`,

          //tray info
          stk_id: item.stk_id,
          stkid1: item.stkid1,
          ordid1: item.ordid1,
          ordnmb1: item.ordnmb1,
          movid1: item.movid1,
          stkid_: item.stkid_,
          wsk_palet: item.wsk_palet,
          outid_: item.outid_,
          isgarden: item.isgarden,
        });
      });

      setIsLoading(true);
      await sendToServer(dataToSent);
    } catch (error) {
      console.error(error);

      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  //helpers
  async function sendToServer(dataToBeSend: Post_AddToZp_DTO[]) {
    if (!dataToBeSend || dataToBeSend.length < 1) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: AddToZpResponse = await query_postDataAsServerAction<
      AddToZpResponse,
      Post_AddToZp_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/addstktoorder",
      token!,
      dataToBeSend
    );

    //check if response array has the same amount of items as sent items
    // const sentItemsQuantity = dataToBeSend.length;
    const responseIDsQuantity = response.length;
    if (responseIDsQuantity === 0) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
      resetWholeState();
    }
    if (responseIDsQuantity !== 0) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }

  //hook return
  return { sendValuesForAddToZp };
};
