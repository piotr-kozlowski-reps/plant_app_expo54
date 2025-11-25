import { View, Text, ScrollView, RefreshControl } from "react-native";
import ButtonIconWithCustomSize from "../button/ButtonIconWithCustomSize";
import { ChevronLeft } from "lucide-react-native";
import { darkColor } from "../../constants/colorThemeVars";
import { Portal } from "@gorhom/portal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Combobox } from "../../types/interfaces-general";
import { useShowScrollViewFlash } from "../../utils/useShowScrollViewFlash";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import ButtonBack from "../button/ButtonBack";
import { FullWindowOverlay } from "react-native-screens";

type Props<T> = {
  closeFn: () => void;
  mainTitle: string;
  comboboxItems: Combobox<T>[];
  refreshAllData: () => void;
  setFormikValue: (value: T | null) => void;
};

export default function ComboboxModal<T>(props: Props<T>) {
  ////vars
  const { closeFn, mainTitle, refreshAllData, comboboxItems, setFormikValue } =
    props;
  const { scrollViewRef } = useShowScrollViewFlash();

  ////tsx
  return (
    <>
      <Portal>
        <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-yellow">
          <SafeAreaView className="relative flex-col items-start justify-start flex-1">
            <View className="px-8 pt-16">
              <Text className="text-center text-foreground font-euclid_semibold">
                {mainTitle}
              </Text>
            </View>

            <View className="flex-1 w-full pt-2 ">
              <ScrollView
                className="w-full px-6 "
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={refreshAllData}
                  />
                }
                persistentScrollbar={true}
                ref={scrollViewRef}
              >
                {comboboxItems.map((item, index) => (
                  <ListItemName
                    key={index}
                    title={item.visibleText}
                    id={index}
                    actionFn={() => setFormikValue(item.value)}
                    isActive={true}
                  />
                ))}
              </ScrollView>
            </View>
            <View className="flex-row items-center justify-between w-full pl-6 mt-6 mb-6">
              <View className="flex-1">
                {/* <ButtonTextAndThreeArrows
                  actionFn={sendValuesForProtectiveTreatment}
                  text="wyślij"
                  isBackground
                  disabled={!canSendData}
                /> */}
              </View>
              <View className="ml-6">
                <ButtonBack actionFn={closeFn} isOutline={false} />
              </View>
            </View>
          </SafeAreaView>

          {/* <View className="absolute z-50 top-16 left-6">
            <ButtonIconWithCustomSize
              actionFn={closeFn}
              icon={<ChevronLeft size={24} color={darkColor} />}
              size={62}
            />
          </View> */}
        </View>
      </Portal>
    </>
  );
}
