import { create } from "zustand";
import {
  User,
  ModulesPermissions,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
} from "../types/interfaces-auth";

export interface TAuthSession {
  //state
  isLoggedIn: boolean;
  user: User | null;
  modulesVisibility: ModulesPermissions | null;
  token: string | null;

  //functions
  setAuthSession: (user: User) => void;
  removeAuthSession: () => void;
  getModuleVisibility: (module: keyof ModulesPermissions) => boolean;
  getSubModuleVisibility: (
    module: keyof ModulesPermissions
  ) => object | undefined;
  getAllModulesVisibility: () => ModulesPermissions | null;
  getModuleVisibilitiesObject: <
    T extends FieldCropsSubmodules | GreenhouseCropsSubmodule
  >(
    module: keyof ModulesPermissions
  ) => T;
}

const useAuthSessionStore = create<TAuthSession>((set, get) => ({
  //state
  isLoggedIn: false,
  user: null,
  modulesVisibility: null,
  token: null,

  //functions
  setAuthSession: (user: User) =>
    set((state) => {
      return {
        isLoggedIn: true,
        user: user,
        token: user.tokens.token,
      };
    }),
  removeAuthSession: () =>
    set((state) => {
      // router.replace("/login");
      return {
        isLoggedIn: false,
        user: null,
        token: null,
      };
    }),
  getModuleVisibility: (module: keyof ModulesPermissions) => {
    return (
      get().user?.modulesVisibility[module].is_whole_module_available || false
    );
  },
  getSubModuleVisibility: (
    module: keyof ModulesPermissions
  ): object | undefined => {
    return get().user?.modulesVisibility[module];
  },
  getAllModulesVisibility: () => {
    return get().user?.modulesVisibility || null;
  },
  getModuleVisibilitiesObject: <
    T extends FieldCropsSubmodules | GreenhouseCropsSubmodule
  >(
    module: keyof ModulesPermissions
  ): T => {
    return get().user?.modulesVisibility[module] as T;
  },
}));

export default useAuthSessionStore;
