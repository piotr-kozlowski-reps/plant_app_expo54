import { toast } from "sonner-native";

type ToastType = "success" | "error" | "warning" | "info";

export const useToastWrapper = () => {
  const toastWrapper = (message: string, toastType: ToastType) => {
    switch (toastType) {
      case "success":
        toast.success(message, { id: message });
        break;

      case "error":
        toast.error(message, { id: message });
        break;

      case "warning":
        toast.warning(message, { id: message });
        break;

      case "info":
        toast.info(message, { id: message });
        break;

      default:
        throw new Error(
          "useToastWrapper -> toastWrapper -> toastType not supported",
        );
    }
  };

  return { toastWrapper };
};
