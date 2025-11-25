import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  LoadingResponse,
  Post_LoadingDTO,
  ZpScannedValueForLoading,
} from "@/features/shared/types/interfaces-loading";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { toast } from "sonner-native";

export const useSendLoadingData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  scannedValues: ZpScannedValueForLoading[],
  resetWholeState: () => void
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  ////fn
  async function sendValuesForLoading() {
    if (!scannedValues || !scannedValues.length) {
      throw new Error(
        "useSendLoadingData -> sendValuesForLoading -> no scannedValues"
      );
    }

    const valuesToBeSent: Post_LoadingDTO[] = [];
    scannedValues.forEach((zp) => {
      const loadingDTO: Post_LoadingDTO = {
        sordid: zp.sordid,
        ordnmb: zp.ordnmb,
        qtrsnd: zp.outcnt,
        qtrsty: getValueOfTraysToBeMovedToGarden(zp.outcnt, zp.stkcnt),
        scanned_raw_value: zp.scannedRawValue,
      };
      valuesToBeSent.push(loadingDTO);
    });

    //send data to server
    let response: LoadingResponse;
    try {
      setIsLoading(true);

      response = await query_postDataAsServerAction<
        LoadingResponse,
        Post_LoadingDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/departures",
        token!,
        valuesToBeSent
      );

      //check if response array has the same amount of items as sent items
      const responseIDsQuantity = response.length;
      const sentItemsQuantity = valuesToBeSent.length;

      if (responseIDsQuantity === sentItemsQuantity) {
        toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
        resetWholeState();
      }
      if (responseIDsQuantity !== sentItemsQuantity) {
        toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { sendValuesForLoading };
};

function getValueOfTraysToBeMovedToGarden(
  outcnt: number | null,
  stkcnt: number
): number | null {
  if (!outcnt) return null;
  return stkcnt - outcnt;
}
