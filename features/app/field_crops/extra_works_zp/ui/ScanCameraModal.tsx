import { View } from "react-native";
import Button from "@/features/shared/ui/button/Button";
import { useCameraPermissions } from "expo-camera";
import BarcodeScanner from "./BarcodeScanner";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";

type TProps = {
  closeFn: () => void;
  extraWork: ExtraWork | undefined;
  nitrogenProtectiveTreatments: ProtectiveTreatment[];
  refreshAllData: () => void;
};

const ScanCameraModal = (props: TProps) => {
  ////vars
  const { closeFn, extraWork, nitrogenProtectiveTreatments, refreshAllData } =
    props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  ////tsx
  return (
    <PermissionsOrGoFurther
      isPermissionGranted={isPermissionGranted}
      requestPermission={requestPermission}
    >
      <BarcodeScanner
        closeFn={closeFn}
        extraWork={extraWork}
        nitrogenProtectiveTreatments={nitrogenProtectiveTreatments}
        refreshAllData={refreshAllData}
        zpListWithOrderedNitrogenIrrigation={[]}
        appPath={
          <AppPath
            paths={[
              INDEX,
              FIELD_CROPS,
              { actionFn: () => {}, name: "Prace Extra GRU - ZP" },
            ]}
          />
        }
      />
    </PermissionsOrGoFurther>
  );
};

export default ScanCameraModal;
