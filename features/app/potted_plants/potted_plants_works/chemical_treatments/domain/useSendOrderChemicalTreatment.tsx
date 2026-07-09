import {
  ChemicalTreatmentOrderResponse,
  ChemicalTreatmentOrderSendDataDTO,
} from "@/features/shared/types/interfaces-chemical_treatments_don";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

type OrderChemicalTreatmentDataToSent = {
  scannedValues: ZPShortenedInfoWithoutTwrnzw[];
  inHowManyDays: number | null;
  protectiveTreatment: ProtectiveTreatment | null;
};

export const useSendOrderChemicalTreatment = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void,
) => {
  ////vars
  const { addDaysToDate } = useDatesHelper();
  const { errorHandler } = useErrorHandler();
  const queryClient = useQueryClient();
  const { token } = useAuthSessionStore();

  /////fn
  async function sendValuesForOrderChemicalTreatmentHandler(
    valuesToSendOrderToChemicalTreatment: OrderChemicalTreatmentDataToSent,
  ) {
    const { scannedValues, inHowManyDays, protectiveTreatment } =
      valuesToSendOrderToChemicalTreatment;

    if (
      !scannedValues ||
      !scannedValues.length ||
      !protectiveTreatment ||
      inHowManyDays === null
    ) {
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!protectiveTreatment)
        toast.error(ERROR_MESSAGES.LACK_OF_CHEMICAL_TREATMENT);
      if (!inHowManyDays)
        toast.error(
          ERROR_MESSAGES.LACK_OF_IN_HOW_MANY_DAYS_TO_CHEMICAL_TREATMENT,
        );

      return;
    }

    /**  guard: cannot order to todays and tomorrows date when is after 13:00*/
    /**
     * @public
     * @guard
     * @order 180
     * zabezpieczenie: nie można zlecić zabiegu chemicznego na <b>dzis lub jutro</b>  -> po <b>godzinie 13stej</b>
     */

    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDays < 2 && !isPossibleToProcess_Before13) {
      toast.warning(ERROR_MESSAGES.CANNOT_ORDER_AFTER_13);
      return;
    }

    /** prepare data */
    /**
     * @public
     * @procedureItem
     * Formularz z wprowadzeniem: ( rodzaju zabiegu chemicznego, daty zlecenia zabiegu chemicznego)
     */

    const chemicalTreatmentOrderDataToBeSent: ChemicalTreatmentOrderSendDataDTO[] =
      [];
    scannedValues.forEach((zp) => {
      const order: ChemicalTreatmentOrderSendDataDTO = {
        //zp
        sordid: zp.sordid,
        ordnmb: zp.ordnmb,

        //date
        chemical_treatment_date: addDaysToDate(
          new Date(Date.now()),
          inHowManyDays ? inHowManyDays : 0,
        ),

        //protective treatment
        treatid: protectiveTreatment.id____,
        tredscrpt: protectiveTreatment.dscrpt,

        //scanned raw value
        scanned_raw_value: zp.scanned_raw_value,
      };

      chemicalTreatmentOrderDataToBeSent.push(order);
    });

    /** send data */
    try {
      setIsLoading(true);
      await sendToServer(chemicalTreatmentOrderDataToBeSent);
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

  ////hook return
  return sendValuesForOrderChemicalTreatmentHandler;

  //helpers
  async function sendToServer(
    dataToBeSend: ChemicalTreatmentOrderSendDataDTO[],
  ) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    /**
     * @public
     * @transformApiItem
     * wysyłka - custom api - POST:
     * adres: <b>{{URL}}</b>/api.php/REST/custom/<b>chemicaltreatmentplan</b>
     * @separator
     * <b>dane</b>:
     * [
     *     {
     *          sordid: number | null;
     *          ordnmb: string;
     * @separator
     *          chemical_treatment_date: Date;
     * @separator
     *          treatid: number;
     *          tredscrpt: string;
     * @separator
     *          scanned_raw_value: string;
     *     }
     * ]
     */

    let response: ChemicalTreatmentOrderResponse =
      await query_postDataAsServerAction<
        ChemicalTreatmentOrderResponse,
        ChemicalTreatmentOrderSendDataDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/chemicaltreatmentplan",
        token!,
        dataToBeSend,
      );

    //check if response array has the same amount of items as sent items
    const responseIDsQuantity = response.length;
    const sentItemsQuantity = dataToBeSend.length;
    if (responseIDsQuantity === sentItemsQuantity) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY, {
        id: MESSAGES.DATA_SENT_SUCCESSFULLY,
      });
    }
    if (responseIDsQuantity !== sentItemsQuantity) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {
        id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA,
      });
    }
  }
};
