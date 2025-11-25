import { useCameraPermissions } from "expo-camera";
import { useState } from "react";

import {
  FieldCropsSubmodules,
  ModulesPermissions,
} from "../types/interfaces-auth";
import { useHandleSubmodulePermission } from "./useHandleSubmodulePermission";

export const useSubmoduleEntryDataAndGuard = <T,>(
  moduleName: keyof ModulesPermissions,
  submoduleValue: keyof T,
  submoduleName: string
) => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  useHandleSubmodulePermission<T>(moduleName, submoduleValue, submoduleName);

  return { isLoading, setIsLoading, isPermissionGranted, requestPermission };
};
