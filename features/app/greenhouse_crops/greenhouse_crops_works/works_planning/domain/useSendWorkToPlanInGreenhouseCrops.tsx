import {
  WorkPlanningDataToSend,
  WorkPlanningResponse,
  WorkPlanningSendDataDTO,
} from "@/features/shared/types/interfaces-works_planning";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { toast } from "sonner-native";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";

export const useSendWorkToPlanInGreenhouseCrops = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  clearScannedValues: () => void,
  closeFn: () => void
) => {
  ////vars
  const { addDaysToDate } = useDatesHelper();
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  const sendWorkToPlanInGreenhouseCropsHandler = async (
    valuesToSendOrderToHardener: WorkPlanningDataToSend
  ) => {
    const { scannedValues, workToPlan, inHowManyDays } =
      valuesToSendOrderToHardener;
    if (
      !scannedValues ||
      !scannedValues.length ||
      !workToPlan ||
      inHowManyDays === null
    ) {
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!workToPlan) toast.error(ERROR_MESSAGES.LACK_OF_WORK_TO_PLAN);
      if (!inHowManyDays)
        toast.error(ERROR_MESSAGES.LACK_OF_IN_HOW_MANY_DAYS_TO_WORK_PLAN);

      return;
    }

    /** guard: cannot order to todays and tomorrows date when is after 13:00 */
    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDays < 3 && !isPossibleToProcess_Before13) {
      toast.warning(
        ERROR_MESSAGES.CANNOT_ORDER_AFTER_13_FOR_TOMORROW_AND_DAY_AFTER_TOMORROW
      );
      return;
    }

    const workPlanningDataToBeSent: WorkPlanningSendDataDTO[] = [];
    scannedValues.forEach((zp) => {
      const item: WorkPlanningSendDataDTO = {
        ordnmb: zp.ordnmb,
        id: zp.rozActivityId,
        plndat: addDaysToDate(
          new Date(Date.now()),
          inHowManyDays ? inHowManyDays : 0
        ),
        scanned_raw_value: zp.scanned_raw_value,
      };

      workPlanningDataToBeSent.push(item);
    });

    try {
      setIsLoading(true);
      await sendToServer(workPlanningDataToBeSent);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      clearScannedValues();
      closeFn();
    }
  };

  //helpers
  async function sendToServer(dataToBeSend: WorkPlanningSendDataDTO[]) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: WorkPlanningResponse = await query_postDataAsServerAction<
      WorkPlanningResponse,
      WorkPlanningSendDataDTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/czynnosciplan",
      token!,
      dataToBeSend
    );

    // //check if response array has the same amount of items as sent items
    // //disabled
    // // const responseIDsQuantity = response.length;
    // // const sentItemsQuantity = dataToBeSend.length;

    // // if (responseIDsQuantity === sentItemsQuantity) {
    // //   toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    // // }
    // // if (responseIDsQuantity !== sentItemsQuantity) {
    // //   toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    // // }

    if (response && response.length) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    }
  }

  ////hook return
  return sendWorkToPlanInGreenhouseCropsHandler;
};
