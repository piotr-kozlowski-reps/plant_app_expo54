import { View } from "react-native";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import BarcodeScanner from "../../../extra_works_zp/ui/BarcodeScanner";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
  NITROGEN_IRRIGATION,
} from "@/features/shared/types/interfaces-navigation";

type Props = {
  protectiveTreatment: ProtectiveTreatment | null;
  protectiveTreatments: ProtectiveTreatment[];
  extraWork: ExtraWork;
  nitrogenIrrigationList: ZpToNitrogenIrrigation[];
  closeFn: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowModalWithSelectConcentration: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  resetValuesForProtectiveTreatments: () => void;
  refreshAllData: () => void;
};

const NitrogenIrrigationConfirmationModal = (props: Props) => {
  ////vars
  const {
    protectiveTreatment,
    extraWork,
    protectiveTreatments,
    nitrogenIrrigationList,

    closeFn,
    setIsLoading,
    setIsShowModalWithSelectConcentration,
    resetValuesForProtectiveTreatments,
    refreshAllData,
  } = props;

  ////vars
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <BarcodeScanner
        closeFn={closeFn}
        extraWork={extraWork}
        nitrogenProtectiveTreatments={protectiveTreatments}
        refreshAllData={refreshAllData}
        zpListWithOrderedNitrogenIrrigation={nitrogenIrrigationList}
        appPath={
          <AppPath
            paths={[
              INDEX,
              FIELD_CROPS,
              FIELD_CROPS_WORKS,
              NITROGEN_IRRIGATION,
              { actionFn: () => {}, name: "Potwierdzenie podlewania azotem" },
            ]}
          />
        }
      />
    </View>
  );
};

export default NitrogenIrrigationConfirmationModal;
