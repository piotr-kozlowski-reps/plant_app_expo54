import {
  AllInternalTransportSubmodules,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
  ModulesPermissions,
  PottedPlantsSubmodules,
} from "@/features/shared/types/interfaces-auth";
import { useGetSubmodulePermission } from "@/features/shared/utils/useGetSubmodulePermission";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { provideNoAccessToSubmoduleMessage } from "@/features/shared/utils/messages";
import { router } from "expo-router";

export const useGetInternalTransportPermission = (
  submoduleType: AllInternalTransportSubmodules,
) => {
  const { getSubmodulePermission } = useGetSubmodulePermission();
  let moduleName: keyof ModulesPermissions = getModuleName(submoduleType);

  useEffect(() => {
    //field crops
    if (submoduleType === "field_crops_works_internal_transport") {
      if (
        !getSubmodulePermission<FieldCropsSubmodules>(moduleName, submoduleType)
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }

    //greenhouse crops
    if (submoduleType === "greenhouse_crops_works_internal_transport") {
      if (
        !getSubmodulePermission<GreenhouseCropsSubmodule>(
          moduleName,
          submoduleType,
        )
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }

    //potted plants
    if (submoduleType === "potted_plants_works_internal_transport") {
      if (
        !getSubmodulePermission<PottedPlantsSubmodules>(
          moduleName,
          submoduleType,
        )
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }
  }, []);
};

//helpers
function getModuleName(
  submoduleType: AllInternalTransportSubmodules,
): keyof ModulesPermissions {
  let moduleName: keyof ModulesPermissions = "field_crops";
  if (submoduleType === "greenhouse_crops_works_internal_transport")
    moduleName = "greenhouse_crops";
  if (submoduleType === "potted_plants_works_internal_transport")
    moduleName = "potted_plants";
  return moduleName;
}
