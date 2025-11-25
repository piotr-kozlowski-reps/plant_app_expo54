import { View } from "react-native";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import Modal from "@/features/shared/ui/modal/Modal";
import ScanCameraModal from "./ScanCameraModal";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useMemo, useState } from "react";
import edocReport_ExtraWorks from "@/features/shared/data-access/edocReport_ExtraWorks";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import {
  EXTRA_WORKS_HOBBY,
  FIELD_CROPS,
  INDEX,
  NavElement,
} from "@/features/shared/types/interfaces-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ItemsList from "@/features/shared/ui/list/ItemsList";
import DeleteZpModal from "./DeleteZpModal";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { primaryColor } from "@/features/shared/constants/colorThemeVars";
import { Stack } from "expo-router";
import edocReport_ProtectiveTreatments from "@/features/shared/data-access/edocReport_ProtectiveTreatments";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useNitrogenProtectiveTreatmentsHelpers } from "../../field_crops_works/nitrogen_irrigation/domain/useNitrogenProtectiveTreatmentsHelpers";

type Props = {
  isHobby: boolean;
};

const ExtraWorksZpEntryPage = (props: Props) => {
  ////vars
  const { isHobby } = props;
  const [isShowScanner, setIsShowScanner] = useShowModal(false);
  const [extraWork, setExtraWork] = useState<ExtraWork>();
  const { filterOnlyNitrogenProtectiveTreatments } =
    useNitrogenProtectiveTreatmentsHelpers();

  //isHobby dependants
  const pathNameForAppPathComponent = isHobby
    ? "Prace Hobby - ZP"
    : "Prace Extra GRU - ZP";
  const paths: NavElement[] = isHobby
    ? [
        INDEX,
        FIELD_CROPS,
        EXTRA_WORKS_HOBBY,
        { name: pathNameForAppPathComponent, actionFn: () => {} },
      ]
    : [
        INDEX,
        FIELD_CROPS,
        { name: pathNameForAppPathComponent, actionFn: () => {} },
      ];

  //data fetch and filter
  const [isLoading, setIsLoading] = useState(false);
  const { extra_works, protectiveTreatments, refreshAllData } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [edocReport_ExtraWorks, edocReport_ProtectiveTreatments],
    });

  //extra works data
  const extraWorksArray = extra_works as unknown as ExtraWork[];
  const filteredExtraWorks: ExtraWork[] = useMemo(() => {
    const foundFilteredExtraWorks = extraWorksArray
      .filter((work) => work.is_ordnmb === true)
      .filter((work) => {
        return work.ishobby === isHobby ? true : false;
      });
    return foundFilteredExtraWorks || [];
  }, [extraWorksArray]);

  //protective treatment data
  const filteredOnlyNitrogenProtectiveTreatments: ProtectiveTreatment[] =
    filterOnlyNitrogenProtectiveTreatments(
      protectiveTreatments as ProtectiveTreatment[]
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
            paths={paths}
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
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default ExtraWorksZpEntryPage;
