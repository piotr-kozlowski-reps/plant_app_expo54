import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { customRegister_ExtraWork } from "@/features/shared/data-access/customRegister_ExtraWork";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

import {
  ConfirmationForExtraWorkResponse,
  ExtraWork,
  Post_ExtraWork_ZP_DTO,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
import {
  getIsHobbyExtraWorkWithTj10,
  getIsHobbyExtraWorkWithTj12,
} from "@/features/shared/utils/hobbyExtraWorksHelpers";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { usePrepareDataToSendExtraWorks } from "@/features/shared/utils/usePrepareDataToSendExtraWorks";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner-native";

export const useSendExtraWorkData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  clearScannedValues: () => void,
  closeFn: () => void,
) => {
  ////vars
  const { prepareDataToSendExtraWorksHandler } =
    usePrepareDataToSendExtraWorks();
  // const { POSTasyncMutation: send_ExtraWork_PostMutation } =
  //   useGetEdocCustomRegisterMutation({
  //     customRegister: customRegister_ExtraWork,
  //   });
  const queryClient = useQueryClient();
  const { token } = useAuthSessionStore();

  //fn
  const sendExtraWork = async (
    extraWork: ExtraWork | undefined,
    scannedValues: ZpScannedValue[],
    begin_date: Date,
    selectedProtectiveTreatment: ProtectiveTreatment | null,
    zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[],
    isHobbyTech?: boolean,
    tjCount?: number | null,
  ) => {
    if (!extraWork || !scannedValues.length || !begin_date) {
      if (!extraWork) toast.error(ERROR_MESSAGES.LACK_OF_EXTRA_WORK);
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!begin_date) toast.error(ERROR_MESSAGES.LACK_OF_DATE);

      return;
    }

    const isActivityIdHobbyWithTj10 = getIsHobbyExtraWorkWithTj10(extraWork);
    const isActivityIdHobbyWithTj12 = getIsHobbyExtraWorkWithTj12(extraWork);
    const isActivityWithTj10OrTj12 =
      isActivityIdHobbyWithTj10 || isActivityIdHobbyWithTj12;
    if (isHobbyTech && !tjCount && isActivityWithTj10OrTj12) {
      toast.error(ERROR_MESSAGES.LACK_OF_TJ12_QUANTITY);
      return;
    }

    const dataToBeSent: Post_ExtraWork_ZP_DTO =
      prepareDataToSendExtraWorksHandler(
        extraWork,
        begin_date,
        scannedValues,
        selectedProtectiveTreatment,
        zpListWithOrderedNitrogenIrrigation,
        tjCount,
      );

    try {
      setIsLoading(true);
      ////old way
      // await send_ExtraWork_PostMutation(dataToBeSent);

      //// new api
      let response: ConfirmationForExtraWorkResponse =
        await query_postDataAsServerAction<any, Post_ExtraWork_ZP_DTO[]>(
          configPerBuild.apiAddress,
          "/api.php/REST/custom/czynnosciextradone",
          token!,
          [dataToBeSent],
        );

      if (response && response.length === 0) {
        clearScannedValues();
        closeFn();
        toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.NITROGEN_IRRIGATION_LIST],
        });
      } else {
        toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    } finally {
      setIsLoading(false);
      clearScannedValues();
      closeFn();
    }
  };

  return { sendExtraWork };
};
