import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import MoveToGardenScanner from "./MoveToGardenScanner";
import { useState } from "react";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const TrayOperationsMoveToGardenEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "tray_operations_move_to_garden",
      "Odepnij na ogródek"
    );

  return (
    <>
      <>
        <Stack.Screen options={{ headerShown: false }} />

        {isLoading ? <LoaderWholeScreen /> : null}

        <PermissionsOrGoFurther
          isPermissionGranted={isPermissionGranted}
          requestPermission={requestPermission}
        >
          <MoveToGardenScanner
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </PermissionsOrGoFurther>
      </>
    </>
  );
};
export default TrayOperationsMoveToGardenEntryPage;
