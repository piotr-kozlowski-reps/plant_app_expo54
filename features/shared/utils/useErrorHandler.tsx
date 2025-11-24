import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "./messages";

export function useErrorHandler() {
  const errorHandler = (error: Error, errorTitle?: string) => {
    switch (error.message) {
      case "Network Error":
        notifyError(ERROR_MESSAGES.NETWORK_ERROR, errorTitle);

      default:
        notifyError(error.message, errorTitle);
    }
    notifyError(error.message);
  };

  const notifyError = (description: string, errorTitle?: string) => {
    toast.error(description);
  };

  return { errorHandler };
}
