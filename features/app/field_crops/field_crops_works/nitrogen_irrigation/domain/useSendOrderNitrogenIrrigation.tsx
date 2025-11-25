import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  NitrogenIrrigationOrderResponse,
  NitrogenIrrigationOrderSendDataDTO,
} from "@/features/shared/types/interfaces-nitrogen_irrigation";
import { OrderToHardenerResponse } from "@/features/shared/types/interfaces-orders_all";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

type OrderNitrogenIrrigationDataToSent = {
  scannedValues: ZPShortenedInfoWithoutTwrnzw[];
  inHowManyDays: number | null;
  protectiveTreatment: ProtectiveTreatment | null;
};

export const useSendOrderNitrogenIrrigation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void
) => {
  ////vars
  const { addDaysToDate } = useDatesHelper();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();
  const queryClient = useQueryClient();

  /////fn
  async function sendValuesForOrderNitrogenIrrigationHandler(
    valuesToSendOrderToHardener: OrderNitrogenIrrigationDataToSent
  ) {
    const { scannedValues, inHowManyDays, protectiveTreatment } =
      valuesToSendOrderToHardener;

    if (
      !scannedValues ||
      !scannedValues.length ||
      !protectiveTreatment ||
      inHowManyDays === null
    ) {
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!protectiveTreatment)
        toast.error(ERROR_MESSAGES.LACK_OF_NITROGEN_CONCENTRATION);
      if (!inHowManyDays)
        toast.error(
          ERROR_MESSAGES.LACK_OF_IN_HOW_MANY_DAYS_TO_IRRIGATE_WITH_NITROGEN
        );

      return;
    }

    /**  guard: cannot order to todays and tomorrows date when is after 13:00*/
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDays < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    /** prepare data */
    const nitrogenIrrigationOrderDataToBeSent: NitrogenIrrigationOrderSendDataDTO[] =
      [];
    scannedValues.forEach((zp) => {
      const orderToHardenerItem: any = {
        //zp
        sordid: zp.sordid,
        ordnmb: zp.ordnmb,

        //date
        irrigation_date: addDaysToDate(
          new Date(Date.now()),
          inHowManyDays ? inHowManyDays : 0
        ),

        //protective treatment
        treatid: protectiveTreatment.id____,
        dscrpt: protectiveTreatment.dscrpt,

        //scanned raw value
        scanned_raw_value: zp.scanned_raw_value,
      };

      nitrogenIrrigationOrderDataToBeSent.push(orderToHardenerItem);
    });

    /** send data */
    try {
      setIsLoading(true);
      await sendToServer(nitrogenIrrigationOrderDataToBeSent);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NITROGEN_IRRIGATION_LIST],
      });
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      resetValues();
    }
  }

  return sendValuesForOrderNitrogenIrrigationHandler;

  //helpers
  async function sendToServer(
    dataToBeSend: NitrogenIrrigationOrderSendDataDTO[]
  ) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: NitrogenIrrigationOrderResponse =
      await query_postDataAsServerAction<
        NitrogenIrrigationOrderResponse,
        NitrogenIrrigationOrderSendDataDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/nitrogenirrigationplan",
        token!,
        dataToBeSend
      );

    //check if response array has the same amount of items as sent items
    const responseIDsQuantity = response.length;
    const sentItemsQuantity = dataToBeSend.length;

    if (responseIDsQuantity === sentItemsQuantity) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    }
    if (responseIDsQuantity !== sentItemsQuantity) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }
};
