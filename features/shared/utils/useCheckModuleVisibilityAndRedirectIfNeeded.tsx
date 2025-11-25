import { router } from "expo-router";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "./messages";

export const useCheckModuleVisibilityAndRedirectIfNeeded = (
  isModuleVisible: boolean
) => {
  useEffect(() => {
    if (!isModuleVisible) {
      toast.warning(ERROR_MESSAGES.MODULE_NOT_AVAILABLE_FOR_THIS_USER);
      router.replace("/");
    }
  }, [isModuleVisible]);
};
