import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
// import CutMainWindow from "./CutMainWindow";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import CotyledonQuiltingMainWindow from "./CotyledonQuiltingMainWindow";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_zpToCotyledonQuilting from "@/features/shared/data-access/edocReport_zpToCotyledonQuilting";
import { useMemo } from "react";
import { CotyledonQuilting } from "@/features/shared/types/interfaces-cotyledon_quilting";
// import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";

// import { useMemo } from "react";
// import { ZpToCut } from "@/features/shared/types/interfaces-cut";
// import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
// import edocReport_CutsList from "@/features/shared/data-access/edocReport_CutsList";

const PottedPlants_CotyledonQuilting_EntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<PottedPlantsSubmodules>(
      "potted_plants",
      "potted_plants_cotyledon_quilting",
      "Pikowanie liścieni",
    );

  //fetch
  const { zpToCotyledonQuilting, refreshAllData: refreshAllDataGotFromHook } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [edocReport_zpToCotyledonQuilting],
    });
  const refreshAllData = refreshAllDataGotFromHook as () => void;

  const zpToCotyledonQuiltingArray = useMemo(() => {
    return zpToCotyledonQuilting as CotyledonQuilting[];
  }, [zpToCotyledonQuilting]);

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <CotyledonQuiltingMainWindow
          setIsLoading={setIsLoading}
          zpToCotyledonQuiltingArray={zpToCotyledonQuiltingArray}
          isLoading={isLoading}
          refreshAllData={refreshAllData}
        />
      </PermissionsOrGoFurther>
    </>
  );
};

export default PottedPlants_CotyledonQuilting_EntryPage;
