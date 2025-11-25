import { useEffect } from "react";
import { useGetSubmodulePermission } from "./useGetSubmodulePermission";
import { ModulesPermissions } from "../types/interfaces-auth";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { provideNoAccessToSubmoduleMessage } from "./messages";

export const useHandleSubmodulePermission = <T,>(
  moduleName: keyof ModulesPermissions,
  submoduleValue: keyof T,
  submoduleName: string
) => {
  const { getSubmodulePermission } = useGetSubmodulePermission();

  useEffect(() => {
    if (!getSubmodulePermission<T>(moduleName, submoduleValue)) {
      toast.warning(provideNoAccessToSubmoduleMessage(submoduleName));
      router.back();
    }
  }, []);
};
