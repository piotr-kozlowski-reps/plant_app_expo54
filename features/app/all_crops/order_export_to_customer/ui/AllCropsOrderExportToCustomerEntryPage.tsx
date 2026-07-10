import {
  AllExportToCustomerSubmodules,
  FieldCropsSubmodules,
  GreenhouseCropsSubmodule,
  ModulesPermissions,
} from "@/features/shared/types/interfaces-auth";
import { Stack, router } from "expo-router";
import OrderExportToCustomerScanner from "./OrderExportToCustomerScanner";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { useCameraPermissions } from "expo-camera";
import { useGetSubmodulePermission } from "@/features/shared/utils/useGetSubmodulePermission";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner-native";
import { provideNoAccessToSubmoduleMessage } from "@/features/shared/utils/messages";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_modulesPins from "@/features/shared/data-access/edocReport_modulesPins";
import { ModulePin } from "@/features/shared/types/interfaces-tray_operations";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import PinConfirmationModal from "@/features/shared/ui/pin-confirmation-modal/PinConfirmationModal";

type Props = {
  submoduleType: AllExportToCustomerSubmodules;
};

const AllCropsOrderExportToCustomerEntryPage = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [isLoading, setIsLoading] = useState(false);
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
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType), {
          id: provideNoAccessToSubmoduleMessage(submoduleType),
        });
        router.back();
      }
    }

    //greenhouse crops
    if (submoduleType === "greenhouse_crops_works_order_export_to_customer") {
      if (
        !getSubmodulePermission<GreenhouseCropsSubmodule>(
          moduleName,
          submoduleType,
        )
      ) {
        toast.warning(provideNoAccessToSubmoduleMessage(submoduleType), {
          id: provideNoAccessToSubmoduleMessage(submoduleType),
        });
        router.back();
      }
    }
  }, []);

  //pin to module in GRU
  const [isPinConfirmed, setIsPinConfirmed] = useState(() =>
    submoduleType === "field_crops_works_order_export_to_customer"
      ? false
      : true,
  );
  const { modulesPins, refreshAllData } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [edocReport_modulesPins],
  });
  const modulesPinsArray = useMemo(() => {
    return modulesPins as ModulePin[];
  }, [modulesPins]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <PermissionsOrGoFurther
        isPermissionGranted={isPermissionGranted}
        requestPermission={requestPermission}
      >
        <OrderExportToCustomerScanner
          submoduleType={submoduleType}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </PermissionsOrGoFurther>

      <ModalInternal
        isOpen={!isPinConfirmed}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <PinConfirmationModal
          confirmPinFn={() => setIsPinConfirmed(true)}
          modulesPinsArray={modulesPinsArray}
          moduleName="gru_order_export_to_customer"
        />
      </ModalInternal>
    </>
  );
};
export default AllCropsOrderExportToCustomerEntryPage;
