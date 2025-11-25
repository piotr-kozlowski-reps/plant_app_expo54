import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  ActivityConfirmationResponse,
  ZpRozActivity,
  ZpRozActivityConfirmation_DTO,
  ZpRozActivityDetails,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

export const useSendActivityConfirmation = (
  closeFn: () => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  async function sendActivityConfirmationHandler(
    currentActivity: ZpRozActivity | null,
    activityDetails: ZpRozActivityDetails[],
    scannedValue: ZpRozWithActivities | null
  ) {
    if (!currentActivity) {
      toast.warning(ERROR_MESSAGES.LACK_OF_ACTIVITY);
      return;
    }
    if (!scannedValue) {
      toast.warning(ERROR_MESSAGES.LACK_OF_SCANNED_VALUE);
      return;
    }

    const dataToBeSent: ZpRozActivityConfirmation_DTO = {
      scanned_raw_value: scannedValue.scannedRawValue,
      id: currentActivity.id,
      dscrpt: currentActivity.dscrpt,
      pcz_id: currentActivity.pcz_id,
      materials: activityDetails.map((material) => ({
        mat_id: material.id,
        dscrpt: material.dscrpt,
        pcm_zrealizowana: material.iledne,
      })),
    };

    try {
      setIsLoading(true);
      await sendToServer(dataToBeSent);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      // setIsToRefresh(true);
      closeFn();
    }
  }

  //helpers
  async function sendToServer(dataToBeSend: ZpRozActivityConfirmation_DTO) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: ActivityConfirmationResponse =
      await query_postDataAsServerAction<
        ActivityConfirmationResponse,
        ZpRozActivityConfirmation_DTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/czynnoscidone",
        token!,
        [dataToBeSend]
      );

    if (response && response.length) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    }
  }

  return { sendActivityConfirmationHandler };
};
