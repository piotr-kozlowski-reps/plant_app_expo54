import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ItemsList from "@/features/shared/ui/list/ItemsList";
import {
  GREENHOUSE_CROPS,
  INDEX,
  NavElement,
} from "@/features/shared/types/interfaces-navigation";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ExtraWorksRoz from "@/features/shared/data-access/edocReport_ExtraWorksRoz";
import edocReport_ProtectiveTreatments from "@/features/shared/data-access/edocReport_ProtectiveTreatments";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useNitrogenProtectiveTreatmentsHelpers } from "@/features/app/field_crops/field_crops_works/nitrogen_irrigation/domain/useNitrogenProtectiveTreatmentsHelpers";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { primaryColor } from "@/features/shared/constants/colorThemeVars";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ScanCameraModal from "@/features/app/all_crops/extra_works_zp/ui/ScanCameraModal";

/**
 * @public
 * @topic
 * @order 10
 * PROCEDURA:
 */
/**
 * @public
 * @procedureDescription
 * 1. wybór Pracy Extra z listy
 * 2. jeżeli PracaExtra == 230 - Podl_Azot -> formularz (wybór stężenia)
 * 3. Skanowanie ZPków lub całych lokalizacji
 */
const ExtraWorksZp_GreenhouseCrops_EntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const [isShowScanner, setIsShowScanner] = useShowModal(false);
  const [extraWork, setExtraWork] = useState<ExtraWork>();

  const { filterOnlyNitrogenProtectiveTreatments } =
    useNitrogenProtectiveTreatmentsHelpers();

  //paths
  const paths: NavElement[] = [
    INDEX,
    GREENHOUSE_CROPS,
    { name: "Prace Extra ROZ - ZP", actionFn: () => {} },
  ];

  //data fetch and filter
  /**
   * @public
   * @topic
   * @order 20
   * REALIZACJA:
   */
  /**
   * @public
   * @procedureItem
   * raporty:
   * @readFile `features/shared/data-access/edocReport_ExtraWorks.ts`
   */
  /**
   * @public
   * @guard
   * parametr: <b>is_ordnmb === true</b>
   * jeżeli PracaHobby: <b>ishobby === true</b> gdy nie to: <b>false</b>
   * jeżeli praca technologiczna: <b>istech === true</b> gdy nie to: <b>false</b>
   */
  /**
   * @public
   * @procedureItem
   * raporty:
   * @readFile `features/shared/data-access/edocReport_ProtectiveTreatments.ts`
   */
  const { extra_works_roz, protectiveTreatments, refreshAllData } =
    useGetEdocReports({
      setIsLoading: setIsLoading,
      reports: [edocReport_ExtraWorksRoz, edocReport_ProtectiveTreatments],
    });
  const extraWorksArray = extra_works_roz as unknown as ExtraWork[];
  const filteredExtraWorks: ExtraWork[] = useMemo(() => {
    const foundFilteredExtraWorks = extraWorksArray.filter(
      (work) => work.is_ordnmb === true,
    );
    return foundFilteredExtraWorks || [];
  }, [extraWorksArray]);

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

  /**
   * @public
   * @procedureItem
   * @readFile `features/app/all_crops/extra_works_zp/ui/BarcodeScanner.tsx`
   */

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
            isRoz
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default ExtraWorksZp_GreenhouseCrops_EntryPage;
