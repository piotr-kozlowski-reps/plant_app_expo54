import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useHandleSubmodulePermission } from "@/features/shared/utils/useHandleSubmodulePermission";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import { Stack } from "expo-router";
import Button from "@/features/shared/ui/button/Button";
import ProtectiveTreatmentForm from "./ProtectiveTreatmentForm";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import { useMemo, useState } from "react";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import edocReport_ProtectiveTreatments from "@/features/shared/data-access/edocReport_ProtectiveTreatments";
import edocReport_ExtraWorks from "@/features/shared/data-access/edocReport_ExtraWorks";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import edocReport_TypeOfTreatment from "@/features/shared/data-access/edocReport_TypeOfTreatment";

const FieldCropsProtectiveTreatmentEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "field_crops_works_protective_treatment",
      "Zabieg ochronny"
    );

  //fetch
  const { protectiveTreatments, extra_works, typeOfTreatment, refreshAllData } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [
        edocReport_ProtectiveTreatments,
        edocReport_ExtraWorks,
        edocReport_TypeOfTreatment,
      ],
    });

  const protectiveTreatmentsArray = useMemo(() => {
    return protectiveTreatments as ProtectiveTreatment[];
  }, [protectiveTreatments]);

  const extraWorksArray = useMemo(() => {
    return extra_works as ExtraWork[];
  }, [extra_works]);

  const typeOfTreatmentArray = useMemo(() => {
    return typeOfTreatment as ExtraWork[];
  }, [typeOfTreatment]);

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <ProtectiveTreatmentForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          protectiveTreatments={protectiveTreatmentsArray}
          extraWorks={extraWorksArray}
          typeOfTreatment={typeOfTreatmentArray}
          refreshAllData={refreshAllData}
        />
      </PermissionsOrGoFurther>
    </>
  );
};
export default FieldCropsProtectiveTreatmentEntryPage;
