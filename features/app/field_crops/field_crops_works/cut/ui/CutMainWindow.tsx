import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import images from "@/features/shared/constants/images";
import { ZpToCut } from "@/features/shared/types/interfaces-cut";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { MESSAGES } from "@/features/shared/utils/messages";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import ZpToCutInfoItem from "./ZpToListInfoItem";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import CutConfirmationModal from "./CutConfirmationModal";
import OrderToCutModal from "./OrderToCutModal";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cutsList: ZpToCut[];
  isLoading: boolean;
  refreshAllData: () => void;
};

const CutMainWindow = (props: Props) => {
  ////vars
  const { setIsLoading, cutsList, isLoading, refreshAllData } = props;
  const [isShowCutConfirmationModal, setIsShowCutConfirmationModal] =
    useShowModal();
  const [isShowOrderToCutModal, setIsShowOrderToCutModal] = useShowModal();

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
              { actionFn: () => {}, name: "Cięcie GRU" },
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
                    title="zlecenie cięcia"
                    id={0}
                    actionFn={() => setIsShowOrderToCutModal(true)}
                  />
                </View>

                <View className="w-full">
                  <ListItemName
                    title="potwierdzenie wykonania"
                    id={0}
                    actionFn={() => setIsShowCutConfirmationModal(true)}
                  />
                </View>
              </View>
            </View>

            <View className="flex-col items-center w-full mt-8">
              <Text className="text-foreground font-default-normal">
                lista ZPków zleconych do cięcia:
              </Text>
            </View>

            <ContainerHorizontalRoundedFrame>
              {!cutsList || !cutsList.length ? (
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

              {cutsList && cutsList.length ? (
                <View className="w-full h-full mt-2">
                  <FlatList<ZpToCut>
                    data={cutsList}
                    renderItem={({ item }: { item: ZpToCut }) => (
                      <ZpToCutInfoItem zpToShow={item} />
                    )}
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
        isOpen={isShowCutConfirmationModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <CutConfirmationModal
          closeFn={() => setIsShowCutConfirmationModal(false)}
          cutsList={cutsList}
          setIsLoading={setIsLoading}
        />
      </ModalInternal>

      <ModalInternal
        isOpen={isShowOrderToCutModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <OrderToCutModal
          closeFn={() => setIsShowOrderToCutModal(false)}
          cutsList={cutsList}
          setIsLoading={setIsLoading}
          refreshAllData={refreshAllData}
        />
      </ModalInternal>
    </View>
  );
};

export default CutMainWindow;
