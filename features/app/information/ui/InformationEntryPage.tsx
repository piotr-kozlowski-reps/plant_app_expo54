import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

import { useCameraPermissions } from "expo-camera";
import InformationScanner from "./InformationScanner";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";

const InformationEntryPage = () => {
  ////vars
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("information")
  );

  return (
    <PermissionsOrGoFurther
      isPermissionGranted={isPermissionGranted}
      requestPermission={requestPermission}
    >
      <InformationScanner />
    </PermissionsOrGoFurther>
  );
};

export default InformationEntryPage;
