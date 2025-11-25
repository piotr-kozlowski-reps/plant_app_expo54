import { View, Text, Button } from "react-native";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import edocReport_ExtraWorks from "@/features/shared/data-access/edocReport_ExtraWorks";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import Modal from "@/features/shared/ui/modal/Modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ItemsList from "@/features/shared/ui/list/ItemsList";
import {
  EXTRA_WORKS_HOBBY,
  FIELD_CROPS,
  INDEX,
  NavElement,
} from "@/features/shared/types/interfaces-navigation";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ExtraWorksQuantityModal from "./ExtraWorksQuantityModal";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { primaryColor } from "@/features/shared/constants/colorThemeVars";
import { useChooseWhichError } from "@/features/shared/utils/getEdocReports/lib/useChooseWhichError";

type Props = {
  isHobby: boolean;
};

const ExtraWorksQuantityEntryPage = (props: Props) => {
  ////vars
  const { isHobby } = props;
  const { chooseWhichErrorToThrow } = useChooseWhichError();
  const [isShowModal, setIsShowModal] = useShowModal(false);
  const [extraWork, setExtraWork] = useState<ExtraWork>();

  //data fetch and filter
  const [isLoading, setIsLoading] = useState(false);
  let extraWorksArray: ExtraWork[] = [];
  let filteredExtraWorks: ExtraWork[] = [];
  let refreshAllData: () => void = () => {};

  const pathNameForAppPathComponent = isHobby
    ? "Prace Hobby - Ilości"
    : "Prace Extra GRU - Ilości";
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

  try {
    const { extra_works, refreshAllData: refreshAllDataGotFromHook } =
      useGetEdocReports({
        setIsLoading: setIsLoading,
        reports: [edocReport_ExtraWorks],
      });
    refreshAllData = refreshAllDataGotFromHook as () => void;
    extraWorksArray = extra_works as unknown as ExtraWork[];
    filteredExtraWorks = useMemo(() => {
      const foundFilteredExtraWorks = extraWorksArray
        .filter((work) => work.is_ordnmb === false)
        .filter((work) => {
          return work.ishobby === isHobby ? true : false;
        });

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
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default ExtraWorksQuantityEntryPage;
