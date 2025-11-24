import { useSecureStore } from "@/features/shared/utils/useSecureStore";

export const useRemoveCredentialsFromSecureStore = () => {
  const { removeFromSecureStore } = useSecureStore();

  const removeCredentialsFromSecureStore = async () => {
    await removeFromSecureStore("username");
    await removeFromSecureStore("password");
  };

  return { removeCredentialsFromSecureStore };
};
