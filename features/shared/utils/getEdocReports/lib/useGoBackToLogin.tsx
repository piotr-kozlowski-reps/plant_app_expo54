import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "../../messages";

export const useGoBackToLogin = () => {
  const { removeAuthSession } = useAuthSessionStore();

  const goBackToLogin = () => {
    removeAuthSession();
    toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
    router.replace("/login");
  };

  return { goBackToLogin };
};
