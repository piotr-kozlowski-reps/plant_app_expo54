import { create } from "zustand";

export interface ShowOfflineNotificationStore {
  isShowedOfflineNotification: boolean;
  setIsShowedOfflineNotification: (value: boolean) => void;
}

export const useShowedOfflineNotificationStore =
  create<ShowOfflineNotificationStore>((set, get) => ({
    //state
    isShowedOfflineNotification: false,

    //methods
    setIsShowedOfflineNotification: (value: boolean) =>
      set(() => ({ isShowedOfflineNotification: value })),
  }));
