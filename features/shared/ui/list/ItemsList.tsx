import AppSectionBackground from "@/features/shared/ui/app-section-background/AppSectionBackground";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import { NavElement } from "../../types/interfaces-navigation";
import { useShowScrollViewFlash } from "../../utils/useShowScrollViewFlash";
import { ExtraWork } from "../../types/interfaces-extra_works";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { Image } from "expo-image";
import images from "../../constants/images";
import { MESSAGES } from "../../utils/messages";

type Props = {
  paths: NavElement[];
  refreshAllData: () => void;
  extraWorks: ExtraWork[];
  actionPerIdFn: (id: number) => void;
};
const ItemsList = (props: Props) => {
  ////vars
  const { paths, refreshAllData, extraWorks, actionPerIdFn } = props;
  const { scrollViewRef } = useShowScrollViewFlash();

  ////tsx
  return (
    <AppSectionBackground>
      <View className="flex-1">
        <View className="flex-col items-center justify-start flex-1 w-full">
          <View className="w-full h-6 opacity-35"></View>
          <View className="w-full px-6">
            <AppPath paths={paths} />
          </View>
          <View className="w-full h-6 opacity-35"></View>

          <View className="w-full pl-6">
            <Text className="mb-2 font-default-semibold text-background-nuance">
              Wybierz pracę z listy:
            </Text>
          </View>

          {extraWorks.length ? (
            <View className="flex-1 w-full pb-16">
              <ScrollView
                className="w-full px-6"
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={refreshAllData}
                  />
                }
                persistentScrollbar={true}
                ref={scrollViewRef}
              >
                {extraWorks.map((extraWork) => (
                  <ListItemName
                    key={extraWork.keyval}
                    title={extraWork.activityname}
                    id={extraWork.keyval}
                    actionFn={actionPerIdFn}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {!extraWorks.length ? (
            <View className="flex-1 w-full pb-16 mt-4">
              <ScrollView
                className="flex-1 w-full h-full px-6"
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={refreshAllData}
                  />
                }
                persistentScrollbar={true}
                ref={scrollViewRef}
              >
                <View className="relative flex-1 w-full h-64">
                  <View className="absolute top-0 bottom-0 left-0 right-0 opacity-50">
                    <View className="flex items-center justify-center w-full h-full">
                      <Image
                        source={images.hashed_background}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                        contentFit="cover"
                      />
                    </View>
                  </View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 rounded-app">
                    <View className="flex items-center justify-center w-full h-full ">
                      <Text className="p-6 bg-yellow font-default-bold text-background-nuance rounded-app">
                        {MESSAGES.LACK_OF_EXTRA_WORKS}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* <Text className="font-nav text-destructive">Brak prac</Text> */}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    </AppSectionBackground>
  );
};

export default ItemsList;
