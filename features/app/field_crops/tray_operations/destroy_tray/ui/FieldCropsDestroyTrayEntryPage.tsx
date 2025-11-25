import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import DestroyTrayScanner from "./DestroyTrayScanner";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const TrayOperationsDestroyTrayEntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "tray_operations_destroy_tray",
      "Niszczenie tacy"
    );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <DestroyTrayScanner />
      </PermissionsOrGoFurther>
    </>
  );
};
export default TrayOperationsDestroyTrayEntryPage;
