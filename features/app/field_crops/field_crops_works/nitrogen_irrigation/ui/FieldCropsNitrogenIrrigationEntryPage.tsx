import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import OrderNitrogenIrrigationScanner from "./OrderToNitrogenIrrigationModal";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ProtectiveTreatments from "@/features/shared/data-access/edocReport_ProtectiveTreatments";
import { useMemo } from "react";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useNitrogenProtectiveTreatmentsHelpers } from "../domain/useNitrogenProtectiveTreatmentsHelpers";
import edocReport_NitrogenIrrigationList from "@/features/shared/data-access/edocReport_NitrogenIrrigation";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import NitrogenIrrigationMainWindow from "./NitrogenIrrigationMainWindow";
import edocReport_ExtraWorks from "@/features/shared/data-access/edocReport_ExtraWorks";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";

const FieldCropsNitrogenIrrigationEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "field_crops_nitrogen_irrigation",
      "Zlecenie podlewania azotem"
    );
  const { filterOnlyNitrogenProtectiveTreatments } =
    useNitrogenProtectiveTreatmentsHelpers();

  //fetch
  const {
    protectiveTreatments,
    zps_to_nitrogen_irrigation,
    extra_works,
    refreshAllData,
  } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [
      edocReport_ProtectiveTreatments,
      edocReport_NitrogenIrrigationList,
      edocReport_ExtraWorks,
    ],
  });
  const filteredOnlyNitrogenProtectiveTreatments: ProtectiveTreatment[] =
    filterOnlyNitrogenProtectiveTreatments(
      protectiveTreatments as ProtectiveTreatment[]
    );
  const extraWorksArray = extra_works as unknown as ExtraWork[];

  const refreshAllDataFn = refreshAllData as () => void;

  const nitrogenIrrigationList: ZpToNitrogenIrrigation[] =
    zps_to_nitrogen_irrigation as ZpToNitrogenIrrigation[];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <NitrogenIrrigationMainWindow
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          protectiveTreatments={filteredOnlyNitrogenProtectiveTreatments}
          refreshAllData={refreshAllDataFn}
          nitrogenIrrigationList={nitrogenIrrigationList}
          extraWorks={extraWorksArray}
        />
      </PermissionsOrGoFurther>
    </>
  );
};
export default FieldCropsNitrogenIrrigationEntryPage;
