import * as Device from "expo-device";
import * as Application from "expo-application";
import { configPerBuild, env } from "@/features/shared/env/env";
import { ProductionOrDevelopment } from "@/features/shared/types/interfaces-phone-info";
import { useEffect, useState } from "react";

import {
  GlobalErrorDTO,
  GlobalErrorResponse,
} from "@/features/shared/types/interfaces-general";
import { toast } from "sonner-native";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { checkOS } from "@/features/shared/utils/checkOS";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";

export const useSendErrorDataToServerLog = (error_message: string) => {
  ///vars
  const { user, token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const [isErrorSent, setIsErrorSent] = useState(false);

  useEffect(() => {
    try {
      const dataToSend: GlobalErrorDTO[] = [
        {
          mldevc: `phone_model: ${
            Device.modelName
          }, os: ${checkOS()}, os_version: ${Device.osVersion}, app_version: ${
            Application.nativeApplicationVersion
          }, app_build: ${
            Application.nativeBuildVersion
          }, production_or_development: ${
            env.NODE_ENV as ProductionOrDevelopment
          }`,
          ml_uid: user?.id,
          mldata: new Date(Date.now()),
          mlprms: { error_message: error_message },
          traceon: true,
        },
      ];

      sendToServer(dataToSend);

      async function sendToServer(dataToSend: GlobalErrorDTO[]) {
        if (!dataToSend || dataToSend.length < 1) {
          toast.warning(
            ERROR_MESSAGES.CANNOT_SEND_ERROR_TO_PRODUCER_LACK_OF_DATA
          );
          return;
        }

        let response: GlobalErrorResponse = await query_postDataAsServerAction<
          GlobalErrorResponse,
          GlobalErrorDTO[]
        >(
          configPerBuild.apiAddress,
          "/api.php/REST/custom/mobilelog",
          token!,
          dataToSend
        );

        const responseIDsQuantity = response.length;
        if (responseIDsQuantity === 1) {
          setIsErrorSent(true);
        }
        if (responseIDsQuantity !== 1) {
          setIsErrorSent(false);
        }
      }
    } catch (error) {
      console.error(error);
      errorHandler(error as Error);
    }
  }, [error_message]);

  return { isErrorSent };
};
