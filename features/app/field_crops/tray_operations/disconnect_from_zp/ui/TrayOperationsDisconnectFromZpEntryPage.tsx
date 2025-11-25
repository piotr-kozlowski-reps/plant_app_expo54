import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import DisconnectFromZpScanner from "./DisconnectFromZpScanner";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import { useMemo, useState } from "react";
import edocReport_DeleteReasons from "@/features/shared/data-access/edocReport_DeleteReasons";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";

import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const TrayOperationsDisconnectFromZpEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "tray_operations_disconnect_from_zp",
      "Odepnij do bufora"
    );

  return (
    <>
      <>
        {isLoading ? <LoaderWholeScreen /> : null}

        <Stack.Screen options={{ headerShown: false }} />

        <PermissionsOrGoFurther
          isPermissionGranted={isPermissionGranted}
          requestPermission={requestPermission}
        >
          <DisconnectFromZpScanner
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            // deleteReasons={deleteReasonsArray}
            // refreshAllData={refreshAllDataTypedAsFunction}
          />
        </PermissionsOrGoFurther>
      </>
    </>
  );
};
export default TrayOperationsDisconnectFromZpEntryPage;
