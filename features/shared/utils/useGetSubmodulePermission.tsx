import { ModulesPermissions } from "../types/interfaces-auth";
import useAuthSessionStore from "../stores/useAuthSessionStore";

export function useGetSubmodulePermission() {
  const { getSubModuleVisibility } = useAuthSessionStore();

  const getSubmodulePermission = <T,>(
    moduleName: keyof ModulesPermissions,
    submoduleValue: keyof T
  ): boolean => {
    const modulePermissions = getSubModuleVisibility(moduleName) as
      | T
      | undefined;

    if (!modulePermissions) return false;
    return modulePermissions[submoduleValue] as boolean;
  };

  return { getSubmodulePermission };
}
