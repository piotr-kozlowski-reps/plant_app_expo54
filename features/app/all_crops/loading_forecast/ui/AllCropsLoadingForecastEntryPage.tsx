import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { Stack } from "expo-router";
import LoadingForecastScanner from "./LoadingForecastScanner";
import {
  AllLoadingForecastSubmodules,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
  ModulesPermissions,
} from "@/features/shared/types/interfaces-auth";
import { useCameraPermissions } from "expo-camera";
import { useGetSubmodulePermission } from "@/features/shared/utils/useGetSubmodulePermission";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { provideNoAccessToSubmoduleMessage } from "@/features/shared/utils/messages";

type Props = {
  submoduleType: AllLoadingForecastSubmodules;
};

const AllCropsLoadingForecastEntryPage = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //permission
  const { getSubmodulePermission } = useGetSubmodulePermission();
  const moduleName: keyof ModulesPermissions =
    submoduleType === "field_crops_works_loading_forecast"
      ? "field_crops"
      : "greenhouse_crops";

  useEffect(() => {
    //field crops
    if (submoduleType === "field_crops_works_loading_forecast") {
      if (
        !getSubmodulePermission<FieldCropsSubmodules>(moduleName, submoduleType)
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }

    //greenhouse crops
    if (submoduleType === "greenhouse_crops_works_loading_forecast") {
      if (
        !getSubmodulePermission<GreenhouseCropsSubmodule>(
          moduleName,
          submoduleType
        )
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }
  }, []);

  // const { isLoading, setIsLoading, isPermissionGranted, requestPermission } =
  //   useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
  //     "field_crops",
  //     "field_crops_works_loading_forecast",
  //     "Prognoza załadunku"
  //   );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <LoadingForecastScanner submoduleType={submoduleType} />
      </PermissionsOrGoFurther>
    </>
  );
};
export default AllCropsLoadingForecastEntryPage;
