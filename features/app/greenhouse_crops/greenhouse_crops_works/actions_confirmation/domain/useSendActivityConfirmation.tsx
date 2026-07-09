import { sendActivityConfirmationToServer } from "@/features/shared/data-access/sendActivityConfirmationToServer";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  ZpRozActivity,
  ZpRozActivityConfirmation_DTO,
  ZpRozActivityDetails,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { toast } from "sonner-native";

export const useSendActivityConfirmation = (
  closeFn: () => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  async function sendActivityConfirmationHandler(
    currentActivity: ZpRozActivity | null,
    activityDetails: ZpRozActivityDetails[],
    scannedValue: ZpRozWithActivities | null,
  ) {
    if (!currentActivity) {
      toast.warning(ERROR_MESSAGES.LACK_OF_ACTIVITY, {
        id: ERROR_MESSAGES.LACK_OF_ACTIVITY,
      });
      return;
    }
    if (!scannedValue) {
      toast.warning(ERROR_MESSAGES.LACK_OF_SCANNED_VALUE, {
        id: ERROR_MESSAGES.LACK_OF_SCANNED_VALUE,
      });
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
      await sendActivityConfirmationToServer(dataToBeSent, token!);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      closeFn();
    }
  }

  return { sendActivityConfirmationHandler };
};
