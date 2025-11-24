import * as SecureStore from "expo-secure-store";

export const useSecureStore = () => {
  const addToSecureStore = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  const removeFromSecureStore = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  };

  const getFromSecureStore = async (key: string) => {
    return await SecureStore.getItemAsync(key);
  };

  return { addToSecureStore, removeFromSecureStore, getFromSecureStore };
};
