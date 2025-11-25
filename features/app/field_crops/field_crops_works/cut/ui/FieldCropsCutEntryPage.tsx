import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import CutMainWindow from "./CutMainWindow";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";

import { useMemo } from "react";
import { ZpToCut } from "@/features/shared/types/interfaces-cut";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import edocReport_CutsList from "@/features/shared/data-access/edocReport_CutsList";

const FieldCropsCutEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "field_crops_works_cut",
      "Cięcie GRU"
    );

  //fetch
  const { zps_to_cut, refreshAllData: refreshAllDataGotFromHook } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [edocReport_CutsList],
    });
  const refreshAllData = refreshAllDataGotFromHook as () => void;

  const cutsListArray = useMemo(() => {
    return zps_to_cut as ZpToCut[];
  }, [zps_to_cut]);

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <CutMainWindow
          setIsLoading={setIsLoading}
          cutsList={cutsListArray}
          isLoading={isLoading}
          refreshAllData={refreshAllData}
        />
      </PermissionsOrGoFurther>
    </>
  );
};

export default FieldCropsCutEntryPage;
