import Button from "@/features/shared/ui/button/Button";
import { Stack } from "expo-router";
import { View } from "react-native";
import PlantsComingUpsCounterScanner from "./PlantsComingUpsCounterScanner";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";

const FieldCropsPlantsComingUpsCounterEntryPage = () => {
  ////vars
  const { isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
      "field_crops",
      "field_crops_works_plants_coming_ups_counter",
      "Przeliczanie wschodów"
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <PlantsComingUpsCounterScanner />
      </PermissionsOrGoFurther>
    </>
  );
};

export default FieldCropsPlantsComingUpsCounterEntryPage;
