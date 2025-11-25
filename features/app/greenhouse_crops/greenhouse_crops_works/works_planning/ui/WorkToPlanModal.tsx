// import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  GREENHOUSE_CROPS,
  INDEX,
  GREENHOUSE_CROPS_WORKS,
} from "@/features/shared/types/interfaces-navigation";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { WorkToPlan } from "@/features/shared/types/interfaces-works_planning";

import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { FlatList } from "react-native-gesture-handler";
import { toast } from "sonner-native";

type Props = {
  closeFn: () => void;
  availableWorks: WorkToPlan[];
  refreshAllData: () => void;
  isLoading: boolean;
  setTargetWorkToPlan: (workToPlan: WorkToPlan) => void;
  appPathName: string;
};

const TargetLocalizationModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    availableWorks,
    refreshAllData,
    isLoading,
    setTargetWorkToPlan,
    appPathName,
  } = props;

  //   //fn
  const setTargetWorkToPlanHandler = (prior_: number) => {
    const foundWorkToPlan = availableWorks.find(
      (work) => work.prior_ === prior_
    );
    if (!foundWorkToPlan) {
      toast.warning(ERROR_MESSAGES.NO_INFO_ABOUT_WORK_TO_PLAN);
      return;
    }
    setTargetWorkToPlan(foundWorkToPlan);
    closeFn();
  };

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        <SafeAreaView className="flex-1 w-full bg-yellow">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                GREENHOUSE_CROPS,
                GREENHOUSE_CROPS_WORKS,
                { actionFn: () => {}, name: appPathName },
              ]}
            />
          </View>

          <View className="w-full h-6 opacity-35"></View>

          <View className="w-full pl-6">
            <Text className="mb-2 font-default-semibold text-background-nuance">
              Co chcesz zaplanować:
            </Text>
          </View>

          <View className="flex-1 w-full px-6">
            <FlatList<WorkToPlan>
              data={availableWorks}
              renderItem={({ item }: { item: WorkToPlan }) => (
                <ListItemName
                  title={item.ptc_kod}
                  id={item.prior_}
                  actionFn={setTargetWorkToPlanHandler}
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
