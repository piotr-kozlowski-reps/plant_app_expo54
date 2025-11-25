import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { Localization } from "@/features/shared/types/interfaces-localization";
import {
  OrderToHardenerResponse,
  OrderToHardenerSendDataDTO,
} from "@/features/shared/types/interfaces-orders_all";
import {
  ZPShortenedInfo,
  ZPShortenedInfoWithoutTwrnzw,
} from "@/features/shared/types/interfaces-zp";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { toast } from "sonner-native";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";

type OrderToHardenerDataToSent = {
  scannedValues: ZPShortenedInfoWithoutTwrnzw[];
  targetLocalization: Localization | null;
  inHowManyDays: number | null;
};

export const useSendOrderToHardener = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  clearScannedValues: () => void,
  closeFn: () => void,
  whatOrderType: AllCropsOrdersSubmodules
) => {
  ////vars
  const { addDaysToDate } = useDatesHelper();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  async function sendValuesForOrderToHardenerHandler(
    valuesToSendOrderToHardener: OrderToHardenerDataToSent
  ) {
    const { scannedValues, targetLocalization, inHowManyDays } =
      valuesToSendOrderToHardener;

    if (
      !scannedValues ||
      !scannedValues.length ||
      !targetLocalization ||
      inHowManyDays === null
    ) {
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!targetLocalization)
        toast.error(ERROR_MESSAGES.LACK_OF_TARGET_LOCALIZATION);
      if (!inHowManyDays) toast.error(ERROR_MESSAGES.LACK_OF_IN_HOW_MANY_DAYS);

      return;
    }

    /** guard: cannot order to todays and tomorrows date when is after 13:00 */
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDays < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    const orderToHardenerDataToBeSent: OrderToHardenerSendDataDTO[] = [];
    scannedValues.forEach((zp) => {
      const orderToHardenerItem: OrderToHardenerSendDataDTO = {
        sordid: zp.sordid,
        ordnmb: zp.ordnmb,
        mov_to: targetLocalization.id____,
        movtyp: getMoveTyp(whatOrderType),
        movdta: addDaysToDate(
          new Date(Date.now()),
          inHowManyDays ? inHowManyDays : 0
        ),
        scanned_raw_value: zp.scanned_raw_value,
      };

      orderToHardenerDataToBeSent.push(orderToHardenerItem);
    });

    try {
      setIsLoading(true);
      await sendToServer(orderToHardenerDataToBeSent);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      clearScannedValues();
      closeFn();
    }
  }

  return sendValuesForOrderToHardenerHandler;

  //helpers
  async function sendToServer(dataToBeSend: OrderToHardenerSendDataDTO[]) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: OrderToHardenerResponse = await query_postDataAsServerAction<
      OrderToHardenerResponse,
      OrderToHardenerSendDataDTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/movementsplan",
      token!,
      dataToBeSend
    );

    //check if response array has the same amount of items as sent items
    //disabled
    // const responseIDsQuantity = response.length;
    // const sentItemsQuantity = dataToBeSend.length;

    // if (responseIDsQuantity === sentItemsQuantity) {
    //   toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    // }
    // if (responseIDsQuantity !== sentItemsQuantity) {
    //   toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    // }

    if (response && response.length) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    }
  }

  function getMoveTyp(
    whatOrderType: AllCropsOrdersSubmodules
  ): "TEMP" | "MOVE" {
    if (whatOrderType === "field_crops_works_order_to_hardener") return "TEMP";
    if (whatOrderType === "field_crops_works_internal_transport") return "MOVE";

    throw new Error("getMoveTyp -> whatOrderType is not valid");
  }
};
