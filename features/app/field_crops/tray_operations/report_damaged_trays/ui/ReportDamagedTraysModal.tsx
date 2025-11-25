import {
  FIELD_CROPS,
  INDEX,
  TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useGetReportDamagedTraysData } from "../domain/useGetReportDamagedTraysData";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ReportDamagedTrays } from "@/features/shared/types/interfaces-report_damaged_trays";
import DamagedTraysItem from "./DamagedTraysItem";

type Props = {
  closeFn: () => void;
  selectedDate: string;
  isMine: boolean;
  isAll: boolean;
};

const ReportDamagedTraysModal = (props: Props) => {
  ////vars
  const { closeFn, selectedDate, isMine, isAll } = props;
  const [isLoading, setIsLoading] = useState(false);

  const { reportDamagedTrays, refreshAllData } = useGetReportDamagedTraysData(
    selectedDate,
    setIsLoading,
    isMine
  );

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full">
      {isLoading ? <LoaderWholeScreen /> : null}

      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              FIELD_CROPS,
              TRAY_OPERATIONS,
              { actionFn: () => {}, name: "Raport zniszczonych tac" },
            ]}
          />
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full mt-2">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="flex-col items-center w-full mt-8">
              <Text className="text-foreground font-nav">
                Raport zniszczonych tac
              </Text>
            </View>
            <View className="flex-row items-center justify-center w-full mt-1 mb-4">
              <View>
                <Text className="text-foreground font-euclid_regular">
                  Zakres:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-foreground font-euclid_bold">
                  {isMine ? "Moje" : "Wszystkie"}
                </Text>
              </View>

              <View className="ml-6">
                <Text className="text-foreground font-euclid_regular">
                  Data:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-foreground font-euclid_bold">
                  {selectedDate}
                </Text>
              </View>
            </View>

            <ContainerHorizontalRoundedFrame>
              {!reportDamagedTrays.length ? (
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
                        {MESSAGES.LACK_OF_DAMAGED_TRAYS}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {reportDamagedTrays.length ? (
                <View className="w-full h-full pb-4 mt-2">
                  <FlatList<ReportDamagedTrays>
                    data={reportDamagedTrays}
                    renderItem={({ item }: { item: ReportDamagedTrays }) => (
                      <DamagedTraysItem tray={item} key={item.stk_id} />
                    )}
                    initialNumToRender={20}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refreshAllData}
                      />
                    }
                  />
                </View>
              ) : null}
            </ContainerHorizontalRoundedFrame>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1"></View>
            <View className="ml-6">
              <ButtonBack actionFn={closeFn} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default ReportDamagedTraysModal;
