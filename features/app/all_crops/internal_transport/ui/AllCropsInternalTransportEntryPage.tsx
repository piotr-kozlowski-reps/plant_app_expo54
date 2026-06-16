import InternalTransportScanner from "./InternalTransportScanner";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { AllInternalTransportSubmodules } from "@/features/shared/types/interfaces-auth";
import { useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import { useGetInternalTransportPermission } from "../domain/useGetInternalTransportPermission";

type Props = {
  submoduleType: AllInternalTransportSubmodules;
};

const AllCropsInternalTransportEntryPage = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //permission
  useGetInternalTransportPermission(submoduleType);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <InternalTransportScanner submoduleType={submoduleType} />
      </PermissionsOrGoFurther>
    </>
  );
};

export default AllCropsInternalTransportEntryPage;
