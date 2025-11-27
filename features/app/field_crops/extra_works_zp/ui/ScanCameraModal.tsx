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
  GREENHOUSE_CROPS,
  INDEX,
  NavElement,
} from "@/features/shared/types/interfaces-navigation";

type TProps = {
  closeFn: () => void;
  extraWork: ExtraWork | undefined;
  nitrogenProtectiveTreatments: ProtectiveTreatment[];
  refreshAllData: () => void;
  isRoz?: boolean;
};

const ScanCameraModal = (props: TProps) => {
  ////vars
  const {
    closeFn,
    extraWork,
    nitrogenProtectiveTreatments,
    refreshAllData,
    isRoz = false,
  } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //paths
  const paths: NavElement[] = isRoz
    ? [
        INDEX,
        GREENHOUSE_CROPS,
        { actionFn: () => {}, name: "Prace Extra ROZ - ZP" },
      ]
    : [
        INDEX,
        FIELD_CROPS,
        { actionFn: () => {}, name: "Prace Extra GRU - ZP" },
      ];

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
        appPath={<AppPath paths={paths} />}
        isRoz
      />
    </PermissionsOrGoFurther>
  );
};

export default ScanCameraModal;
