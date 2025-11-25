import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ListItemName from "../../../extra_works_zp/ui/ListItemName";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import ZpToListInfoItem from "../../cut/ui/ZpToListInfoItem";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";

import NitrogenIrrigationConfirmationModal from "./NitrogenIrrigationConfirmationModal";
import OrderToNitrogenIrrigationModal from "./OrderToNitrogenIrrigationModal";
import { useChosenProtectiveTreatment } from "../domain/useChosenProtectiveTreatment";
import SelectConcentrationOfNitrogenModal from "./SelectConcentrationOfNitrogenModal";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  nitrogenIrrigationList: ZpToNitrogenIrrigation[];
  isLoading: boolean;
  refreshAllData: () => void;
  protectiveTreatments: ProtectiveTreatment[];
  extraWorks: ExtraWork[];
};

const NitrogenIrrigationMainWindow = (props: Props) => {
  ////vars
  const {
    setIsLoading,
    nitrogenIrrigationList,
    isLoading,
    refreshAllData,
    protectiveTreatments,
    extraWorks,
  } = props;

  const extraWorkForNitrogenIrrigation = extraWorks.find((extraWork) =>
    extraWork.activityname.startsWith("230")
  );

  //state
  const [
    isShowNitrogenIrrigationConfirmationModal,
    setIsShowNitrogenIrrigationConfirmationModal,
  ] = useShowModal();
  const [
    isShowOrderToNitrogenIrrigationModal,
    setIsShowOrderToNitrogenIrrigationModal,
  ] = useShowModal();
  const {
    protectiveTreatment,
    isShowModalWithSelectConcentration,

    setIsShowModalWithSelectConcentration,
    resetValuesForProtectiveTreatments,
    changeProtectiveTreatment,
  } = useChosenProtectiveTreatment();

  ////tsx
  return (
    <View className="relative w-full h-full">
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              FIELD_CROPS,
              FIELD_CROPS_WORKS,
              { actionFn: () => {}, name: "Podlewanie azotem" },
            ]}
          />
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full mt-6">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="flex-col items-center w-full mb-[4px]">
              <View className="flex-col items-center justify-between w-full">
                <View className="w-full">
                  <Text className="mb-2 font-default-semibold text-background-nuance">
                    Wybierz co chcesz zrobić:
                  </Text>
                </View>

                <View className="w-full">
                  <ListItemName
                    title="zlecenie podlewania azotem"
                    id={0}
                    actionFn={() =>
                      setIsShowOrderToNitrogenIrrigationModal(true)
                    }
                  />
                </View>

                <View className="w-full">
                  <ListItemName
                    title="potwierdzenie podlewania azotem"
                    id={0}
                    actionFn={() =>
                      setIsShowNitrogenIrrigationConfirmationModal(true)
                    }
                  />
                </View>
              </View>
            </View>

            <View className="flex-col items-center w-full mt-8">
              <Text className="text-foreground font-default-normal">
                lista ZPków zleconych do podlania azotem:
              </Text>
            </View>
            <ContainerHorizontalRoundedFrame>
              {!nitrogenIrrigationList || !nitrogenIrrigationList.length ? (
                <View className="relative flex-1 w-full h-full">
                  <View className="absolute top-0 bottom-0 left-0 right-0 opacity-50 rounded-app">
                    <View className="flex items-center justify-center w-full h-full">
                      <Image
                        source={images.hashed_background}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: 32,
                        }}
                        contentFit="cover"
                      />
                    </View>
                  </View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 rounded-app">
                    <View className="flex items-center justify-center w-full h-full ">
                      <Text className="p-6 bg-yellow font-default-bold text-background-nuance rounded-app">
                        {MESSAGES.LACK_OF_ZPS_TO_CUT}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {nitrogenIrrigationList && nitrogenIrrigationList.length ? (
                <View className="w-full h-full mt-2">
                  <FlatList<ZpToNitrogenIrrigation>
                    data={nitrogenIrrigationList}
                    renderItem={({
                      item,
                    }: {
                      item: ZpToNitrogenIrrigation;
                    }) => <ZpToListInfoItem zpToShow={item} />}
                    initialNumToRender={20}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refreshAllData}
                      />
                    }
                    style={{ marginBottom: 12 }}
                  />
                </View>
              ) : null}
            </ContainerHorizontalRoundedFrame>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1"></View>
            <View className="ml-6">
              <ButtonBack actionFn={() => router.back()} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ModalInternal
        isOpen={isShowNitrogenIrrigationConfirmationModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <NitrogenIrrigationConfirmationModal
          closeFn={() => setIsShowNitrogenIrrigationConfirmationModal(false)}
          setIsLoading={setIsLoading}
          setIsShowModalWithSelectConcentration={
            setIsShowModalWithSelectConcentration
          }
          protectiveTreatment={protectiveTreatment}
          resetValuesForProtectiveTreatments={
            resetValuesForProtectiveTreatments
          }
          extraWork={extraWorkForNitrogenIrrigation!}
          protectiveTreatments={protectiveTreatments}
          refreshAllData={refreshAllData}
          nitrogenIrrigationList={nitrogenIrrigationList}
        />
      </ModalInternal>

      <ModalInternal
        isOpen={isShowOrderToNitrogenIrrigationModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <OrderToNitrogenIrrigationModal
          closeFn={() => setIsShowOrderToNitrogenIrrigationModal(false)}
          setIsLoading={setIsLoading}
          protectiveTreatment={protectiveTreatment}
          setIsShowModalWithSelectConcentration={
            setIsShowModalWithSelectConcentration
          }
          resetValuesForProtectiveTreatments={
            resetValuesForProtectiveTreatments
          }
          nitrogenIrrigationList={nitrogenIrrigationList}
        />
      </ModalInternal>

      <ModalInternal
        isOpen={isShowModalWithSelectConcentration}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <SelectConcentrationOfNitrogenModal
          closeFn={() => setIsShowModalWithSelectConcentration(false)}
          protectiveTreatments={protectiveTreatments}
          refreshAllData={refreshAllData}
          changeProtectiveTreatment={changeProtectiveTreatment}
          isLoading={isLoading}
        />
      </ModalInternal>
    </View>
  );
};
export default NitrogenIrrigationMainWindow;
