import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import AddToZpScanner from "./AddToZpScanner";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const TrayOperationsAddToZpEntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "tray_operations_add_to_zp",
      "Przypnij do ZP"
    );

  return (
    <>
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <PermissionsOrGoFurther
          isPermissionGranted={isPermissionGranted}
          requestPermission={requestPermission}
        >
          <AddToZpScanner />
        </PermissionsOrGoFurther>
      </>
    </>
  );
};
export default TrayOperationsAddToZpEntryPage;
