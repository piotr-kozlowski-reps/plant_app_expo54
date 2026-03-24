import { Stack } from "expo-router";
import { View } from "react-native";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useShowModal } from "@/features/shared/utils/useShowModal";
// import ScanCameraModal from "./ScanCameraModal";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ExtraWorks from "@/features/shared/data-access/edocReport_ExtraWorks";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import ItemsList from "@/features/shared/ui/list/ItemsList";
import {
  EXTRA_WORKS_HOBBY,
  FIELD_CROPS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { primaryColor } from "@/features/shared/constants/colorThemeVars";
import edocReport_ProtectiveTreatments from "@/features/shared/data-access/edocReport_ProtectiveTreatments";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useNitrogenProtectiveTreatmentsHelpers } from "../../../field_crops_works/nitrogen_irrigation/domain/useNitrogenProtectiveTreatmentsHelpers";
import ScanCameraModal from "../../../extra_works_zp/ui/ScanCameraModal";

const ExtraWorksHobbyTechnologyEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const [isShowScanner, setIsShowScanner] = useShowModal(false);
  const [extraWork, setExtraWork] = useState<ExtraWork>();
  const { filterOnlyNitrogenProtectiveTreatments } =
    useNitrogenProtectiveTreatmentsHelpers();

  //data fetch and filter
  const { extra_works, protectiveTreatments, refreshAllData } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [edocReport_ExtraWorks, edocReport_ProtectiveTreatments],
    });

  //extra works data
  const extraWorksArray = extra_works as unknown as ExtraWork[];
  const filteredExtraWorks: ExtraWork[] = useMemo(() => {
    const foundFilteredExtraWorks = extraWorksArray.filter((work) => {
      return work.istech === true;
    });
    return foundFilteredExtraWorks || [];
  }, [extraWorksArray]);

  // console.log("filteredExtraWorks", filteredExtraWorks);

  //protective treatment data
  const filteredOnlyNitrogenProtectiveTreatments: ProtectiveTreatment[] =
    filterOnlyNitrogenProtectiveTreatments(
      protectiveTreatments as ProtectiveTreatment[],
    );
  const refreshAllDataFn = refreshAllData as () => void;

  //open scanner handler
  const openScannerHandler = (id: number) => {
    const foundExtraWork = extraWorksArray.find((work) => work.keyval === id);
    if (!foundExtraWork) {
      throw new Error("openScannerHandler -> Extra work not found");
    }
    setExtraWork(foundExtraWork);
    setIsShowScanner(true);
  };

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}
        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <ItemsList
            paths={[
              INDEX,
              FIELD_CROPS,
              EXTRA_WORKS_HOBBY,
              { name: "Prace HOBBY", actionFn: () => {} },
            ]}
            refreshAllData={refreshAllData}
            extraWorks={filteredExtraWorks}
            actionPerIdFn={openScannerHandler}
          />
          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
        <ModalInternal
          isOpen={isShowScanner}
          isTransparent={false}
          backgroundColor={primaryColor}
        >
          <ScanCameraModal
            closeFn={() => setIsShowScanner(false)}
            extraWork={extraWork}
            nitrogenProtectiveTreatments={
              filteredOnlyNitrogenProtectiveTreatments
            }
            refreshAllData={refreshAllDataFn}
            isHobbyTech={true}
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default ExtraWorksHobbyTechnologyEntryPage;
