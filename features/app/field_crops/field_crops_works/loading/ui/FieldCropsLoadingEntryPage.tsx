import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import LoadingScanner from "./LoadingScanner";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const FieldCropsLoadingEntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "field_crops_works_loading",
      "Załadunek"
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <LoadingScanner />
      </PermissionsOrGoFurther>
    </>
  );
};
export default FieldCropsLoadingEntryPage;
