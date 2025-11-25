import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { ControlSowingChanges } from "@/features/shared/types/interface-control_sowing_changes";
import {
  MoveToGardenResponse,
  Post_MoveToGarden_DTO,
  TrayScannedValueForMovingToGarden,
} from "@/features/shared/types/interfaces-move_to_garden";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useGetErrorsFromControlSowingChangesReport } from "@/features/shared/utils/useGetErrorsFromControlSowingChangesReport";

import { toast } from "sonner-native";

export const useSendMoveToGardenData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scannedValues: TrayScannedValueForMovingToGarden[],
  isDefective: boolean,
  resetWholeState: () => void
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();
  const { getErrorsFromControlSowingChangesReport } =
    useGetErrorsFromControlSowingChangesReport();

  //fn
  const sendValuesForMoveToGarden = async () => {
    if (!scannedValues || !scannedValues.length) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    /** guards */
    //check errtxt from report 119
    const allErrors = await getErrorsFromControlSowingChangesReport(
      scannedValues
    );
    if (allErrors.length) {
      allErrors.forEach((item) => {
        toast.warning(
          `Znaleziono błąd w tacy (${item.scannedValue.stk_id}): ${item.errorText}`
        );
      });
      return;
    }

    const dataToSent: Post_MoveToGarden_DTO[] = [];
    scannedValues.forEach((item) => {
      dataToSent.push({
        //zp data from zp object
        ordnmb: item.ordnmb,

        stk_id: item.stk_id,
        scanned_raw_value: item.scannedRawValue,
        // isDefective: isDefective,

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
  async function sendToServer(dataToBeSend: Post_MoveToGarden_DTO[]) {
    if (!dataToBeSend || dataToBeSend.length < 1) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: MoveToGardenResponse = await query_postDataAsServerAction<
      MoveToGardenResponse,
      Post_MoveToGarden_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/removestktogarden",
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
  return { sendValuesForMoveToGarden };
};
