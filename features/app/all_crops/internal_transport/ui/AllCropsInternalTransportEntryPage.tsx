import InternalTransportScanner from "./InternalTransportScanner";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import {
  AllInternalTransportSubmodules,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
  ModulesPermissions,
} from "@/features/shared/types/interfaces-auth";
import { useCameraPermissions } from "expo-camera";

import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { provideNoAccessToSubmoduleMessage } from "@/features/shared/utils/messages";
import { useGetSubmodulePermission } from "@/features/shared/utils/useGetSubmodulePermission";

type Props = {
  submoduleType: AllInternalTransportSubmodules;
};

const FieldCropsInternalTransportEntryPage = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //permission
  const { getSubmodulePermission } = useGetSubmodulePermission();

  const moduleName: keyof ModulesPermissions =
    submoduleType === "field_crops_works_internal_transport"
      ? "field_crops"
      : "greenhouse_crops";

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
          submoduleType
        )
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <InternalTransportScanner submoduleType={submoduleType} />
      </PermissionsOrGoFurther>
    </>
  );
};

export default FieldCropsInternalTransportEntryPage;
