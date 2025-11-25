import {
  AllExportToCustomerSubmodules,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
  ModulesPermissions,
} from "@/features/shared/types/interfaces-auth";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { Stack } from "expo-router";
import OrderExportToCustomerScanner from "./OrderExportToCustomerScanner";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useCameraPermissions } from "expo-camera";
import { useGetSubmodulePermission } from "@/features/shared/utils/useGetSubmodulePermission";
import { useEffect } from "react";
import { toast } from "sonner-native";
import { provideNoAccessToSubmoduleMessage } from "@/features/shared/utils/messages";
import { router } from "expo-router";

type Props = {
  submoduleType: AllExportToCustomerSubmodules;
};

const AllCropsOrderExportToCustomerEntryPage = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //permission
  const { getSubmodulePermission } = useGetSubmodulePermission();
  const moduleName: keyof ModulesPermissions =
    submoduleType === "field_crops_works_order_export_to_customer"
      ? "field_crops"
      : "greenhouse_crops";

  useEffect(() => {
    //field crops
    if (submoduleType === "field_crops_works_order_export_to_customer") {
      if (
        !getSubmodulePermission<FieldCropsSubmodules>(moduleName, submoduleType)
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType));
        router.back();
      }
    }

    //greenhouse crops
    if (submoduleType === "greenhouse_crops_works_order_export_to_customer") {
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <OrderExportToCustomerScanner submoduleType={submoduleType} />
      </PermissionsOrGoFurther>
    </>
  );
};
export default AllCropsOrderExportToCustomerEntryPage;
