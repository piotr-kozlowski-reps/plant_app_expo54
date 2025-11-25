import { useErrorHandler } from "./useErrorHandler";
import axios from "axios";
import { ERROR_MESSAGES } from "./messages";
import { useShowedOfflineNotificationStore } from "../stores/useShowedOfflineNotificationStore";

export const useChooseWhichErrorToHandle = () => {
  const { errorHandler } = useErrorHandler();
  const { isShowedOfflineNotification, setIsShowedOfflineNotification } =
    useShowedOfflineNotificationStore();

  const chooseWhichErrorToHandle = (err: any) => {
    if (err.message === "Request failed with status code 401")
      throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);

    if (axios.isAxiosError(err) && err.code === "ERR_BAD_REQUEST") {
      errorHandler(new Error(ERROR_MESSAGES.BAD_REQUEST));
      return;
    }

    if (err.message === "Network Error") {
      if (isShowedOfflineNotification) return;
      errorHandler(new Error(ERROR_MESSAGES.OFFLINE));
      setIsShowedOfflineNotification(true);
      return;
    }

    throw new Error(ERROR_MESSAGES.HAVE_NO_IDEA_ERROR);
  };

  return { chooseWhichErrorToHandle };
};
