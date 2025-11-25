import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import ReplaceTrayScanner from "./ReplaceTrayScanner";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const FieldCropsReplacementTrayEntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "tray_operations_replacement_tray",
      "Podmiana tacy"
    );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <ReplaceTrayScanner />
      </PermissionsOrGoFurther>
    </>
  );
};
export default FieldCropsReplacementTrayEntryPage;
