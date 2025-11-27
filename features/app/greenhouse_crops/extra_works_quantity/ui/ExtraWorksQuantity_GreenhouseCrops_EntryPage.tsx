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
import { useChooseWhichError } from "@/features/shared/utils/getEdocReports/lib/useChooseWhichError";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import edocReport_ExtraWorksRoz from "@/features/shared/data-access/edocReport_ExtraWorksRoz";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ExtraWorksQuantityModal from "@/features/app/field_crops/extra_works_quantity/ui/ExtraWorksQuantityModal";
import { primaryColor } from "@/features/shared/constants/colorThemeVars";

const ExtraWorksQuantity_GreenhouseCrops_EntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const { chooseWhichErrorToThrow } = useChooseWhichError();
  const [isShowModal, setIsShowModal] = useShowModal(false);
  const [extraWork, setExtraWork] = useState<ExtraWork>();

  //paths
  const paths: NavElement[] = [
    INDEX,
    GREENHOUSE_CROPS,

    { name: "Prace Extra ROZ - Ilości", actionFn: () => {} },
  ];

  let extraWorksArray: ExtraWork[] = [];
  let filteredExtraWorks: ExtraWork[] = [];
  let refreshAllData: () => void = () => {};

  try {
    const { extra_works_roz, refreshAllData: refreshAllDataGotFromHook } =
      useGetEdocReports({
        setIsLoading: setIsLoading,
        reports: [edocReport_ExtraWorksRoz],
      });
    refreshAllData = refreshAllDataGotFromHook as () => void;
    extraWorksArray = extra_works_roz as unknown as ExtraWork[];
    filteredExtraWorks = useMemo(() => {
      const foundFilteredExtraWorks = extraWorksArray.filter(
        (work) => work.is_ordnmb === false
      );
      //     .filter((work) => {
      //       return work.ishobby === isHobby ? true : false;
      //     });

      return foundFilteredExtraWorks || [];
    }, [extraWorksArray]);
  } catch (error) {
    chooseWhichErrorToThrow(error as Error);
  }

  //open scanner handler
  const openModalHandler = (id: number) => {
    const foundExtraWork = extraWorksArray.find((work) => work.keyval === id);
    if (!foundExtraWork) {
      throw new Error("openScannerHandler -> Extra work not found");
    }
    setExtraWork(foundExtraWork);
    setIsShowModal(true);
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
            actionPerIdFn={openModalHandler}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>

        <ModalInternal
          isOpen={isShowModal}
          isTransparent={false}
          backgroundColor={primaryColor}
        >
          <ExtraWorksQuantityModal
            closeFn={() => setIsShowModal(false)}
            extraWork={extraWork}
            setIsLoading={setIsLoading}
            isRoz
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default ExtraWorksQuantity_GreenhouseCrops_EntryPage;
