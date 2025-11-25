import { GeneralWorksSubmodules } from "@/features/shared/types/interfaces-auth";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { Stack } from "expo-router";
import WateringPlantsScanner from "./WateringPlantsScanner";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import { useMemo } from "react";
import { GeneralWork } from "@/features/shared/types/interfaces-general_works";
import edocReport_GeneralWorks from "@/features/shared/data-access/edocReport_GeneralWorks";

const GeneralWorksWateringPlantsEntryPage = () => {
  ////vars
  const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
    useSubmoduleEntryDataAndGuard<GeneralWorksSubmodules>(
      "general_works",
      "watering_plants",
      "Podlewanie roślin"
    );

  //fetch
  const { generalWorks } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [edocReport_GeneralWorks],
  });

  const generalWorksArray = useMemo(() => {
    return generalWorks as GeneralWork[];
  }, [generalWorks]);

  const wateringPlantsActivity = useMemo(() => {
    return generalWorksArray.find(
      (work) => work.module_id === "watering_plants"
    );
  }, [generalWorksArray]);

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {isLoading ? <LoaderWholeScreen /> : null}

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <WateringPlantsScanner
          setIsLoading={setIsLoading}
          wateringPlantsActivity={wateringPlantsActivity}
        />
      </PermissionsOrGoFurther>
    </>
  );
};
export default GeneralWorksWateringPlantsEntryPage;
