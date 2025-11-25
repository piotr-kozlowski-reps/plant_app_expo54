import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import { Localization } from "@/features/shared/types/interfaces-localization";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { toast } from "sonner-native";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { FlatList } from "react-native-gesture-handler";
import { useGetOrderDetailsDependingOnType } from "../domain/useGetOrderDetailsDependingOnType";
import { useGetAppPathForOrdersAll } from "@/features/shared/utils/useGetAppPathForOrdersAll";

type Props = {
  closeFn: () => void;
  localizations: Localization[];
  setTargetLocalizationHandler: (localization: Localization) => void;
  refreshAllData: () => void;
  whatOrderType: AllCropsOrdersSubmodules;
  isLoading: boolean;
};

const TargetLocalizationModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    localizations,
    setTargetLocalizationHandler,
    refreshAllData,
    whatOrderType,
    isLoading,
  } = props;
  const { submoduleName } = useGetOrderDetailsDependingOnType(whatOrderType);
  const { getAppPathForOrdersAll } = useGetAppPathForOrdersAll();

  //fn
  const setTargetLocalization = (id: number) => {
    const foundLocalization = localizations.find((loc) => loc.id____ === id);
    if (!foundLocalization) {
      toast.warning(ERROR_MESSAGES.NO_INFO_ABOUT_LOCALIZATION);
      return;
    }

    setTargetLocalizationHandler(foundLocalization);
    closeFn();
  };

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        <SafeAreaView className="flex-1 w-full bg-yellow">
          <View className="w-full px-6 mt-4">
            {getAppPathForOrdersAll(submoduleName, whatOrderType)}
          </View>

          <View className="w-full h-6 opacity-35"></View>

          <View className="w-full pl-6">
            <Text className="mb-2 font-default-semibold text-background-nuance">
              Wybierz docelową lokalizację:
            </Text>
          </View>

          <View className="flex-1 w-full px-6">
            <FlatList<Localization>
              data={localizations}
              renderItem={({ item }: { item: Localization }) => (
                <ListItemName
                  title={item.planam}
                  id={item.id____}
                  actionFn={setTargetLocalization}
                />
              )}
              refreshing={isLoading}
              onRefresh={refreshAllData}
              initialNumToRender={15}
            />
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1"></View>
            <View className="ml-6">
              <ButtonBack isOutline={false} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};
export default TargetLocalizationModal;
