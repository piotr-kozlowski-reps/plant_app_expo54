import { useCameraPermissions } from "expo-camera";
import BarcodeScanner from "./BarcodeScanner";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import PermissionsOrGoFurther from "@/features/shared/ui/permision_or_go_further/PermissionsOrGoFurther";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  EXTRA_WORKS_HOBBY,
  EXTRA_WORKS_HOBBY_TECHNOLOGY,
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
  isHobbyTech?: boolean;
};

const ScanCameraModal = (props: TProps) => {
  ////vars
  const {
    closeFn,
    extraWork,
    nitrogenProtectiveTreatments,
    refreshAllData,
    isRoz = false,
    isHobbyTech = false,
  } = props;
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  //paths
  const paths: NavElement[] = [];
  if (isRoz)
    paths.push(INDEX, GREENHOUSE_CROPS, {
      actionFn: () => {},
      name: "Prace Extra ROZ - ZP",
    });
  if (isHobbyTech)
    paths.push(
      INDEX,
      FIELD_CROPS,
      EXTRA_WORKS_HOBBY,
      EXTRA_WORKS_HOBBY_TECHNOLOGY,
      {
        actionFn: () => {},
        name: "Prace Extra HOBBY - ZP",
      },
    );
  if (!isRoz && !isHobbyTech)
    paths.push(INDEX, FIELD_CROPS, {
      actionFn: () => {},
      name: "Prace Extra GRU - ZP",
    });

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
        isRoz={isRoz}
        isHobbyTech={isHobbyTech}
      />
    </PermissionsOrGoFurther>
  );
};

export default ScanCameraModal;
