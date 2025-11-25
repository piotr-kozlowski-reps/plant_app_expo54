import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { useCameraPermissions } from "expo-camera";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import GreenhouseCropsWorksPlanningScanner from "./GreenhouseCropsWorksPlanningScanner";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";

import {
  WorksPlanningVariant,
  WorkToPlan,
} from "@/features/shared/types/interfaces-works_planning";
import edocReport_AvailableWorksToChooseInGreenhouseCrops from "@/features/shared/data-access/edocReport_AvailableWorksToChooseInGreenhouseCrops";

type Props = {
  variant: WorksPlanningVariant;
};

const GreenhouseCropsWorksPlanningEntryPage = (props: Props) => {
  ////vars
  const { variant } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //fetch data
  const { works_to_plan, refreshAllData } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [edocReport_AvailableWorksToChooseInGreenhouseCrops],
  });

  const availableWorksArray = useMemo(() => {
    return works_to_plan as unknown as WorkToPlan[];
  }, [works_to_plan]);
  const filteredWorksArrayDependingOnVariant = useMemo(() => {
    if (variant === "greenhouse_crops_works_works_planning_tomato") {
      return availableWorksArray.filter((work) => work.prior_ < 100);
    }
    if (variant === "greenhouse_crops_works_works_planning_cucumber") {
      return availableWorksArray.filter((work) => work.prior_ >= 100);
    }

    throw new Error("filteredWorksArrayDependingOnVariant -> bad variant");
  }, [variant, availableWorksArray]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <GreenhouseCropsWorksPlanningScanner
          variant={variant}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          availableWorks={filteredWorksArrayDependingOnVariant}
          refreshAllData={refreshAllData}
        />
      </PermissionsOrGoFurther>
    </>
  );
};

export default GreenhouseCropsWorksPlanningEntryPage;
