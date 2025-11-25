import { create } from "zustand";

export interface TAppNotUpToDate {
  //state
  isAppUpToDate: boolean;

  //functions
  setIsAppUpToDate: (isAppUpToDate: boolean) => void;
}

const useAppNotUpToDate_Store = create<TAppNotUpToDate>((set, get) => ({
  //state
  isAppUpToDate: false,

  //functions
  setIsAppUpToDate: (isAppUpToDate: boolean) => {
    set(() => {
      return {
        isAppUpToDate: isAppUpToDate,
      };
    });
  },
}));

export default useAppNotUpToDate_Store;
