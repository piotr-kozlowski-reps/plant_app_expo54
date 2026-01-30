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
import {
  WorkToPlan,
  WorkType,
} from "@/features/shared/types/interfaces-works_planning";

import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { FlatList } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { useMemo } from "react";

type Props = {
  closeFn: () => void;
  availableWorks: WorkToPlan[];
  refreshAllData: () => void;
  isLoading: boolean;
  setTargetWorkToPlan: (workToPlan: WorkToPlan) => void;
  appPathName: string;
};
type Separator = { type__: "separator" };

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

  //fn
  const setTargetWorkToPlanHandler = (prior_: number) => {
    const foundWorkToPlan = availableWorks.find(
      (work) => work.prior_ === prior_,
    );
    if (!foundWorkToPlan) {
      toast.warning(ERROR_MESSAGES.NO_INFO_ABOUT_WORK_TO_PLAN);
      return;
    }
    setTargetWorkToPlan(foundWorkToPlan);
    closeFn();
  };

  const preparedDataToDisplay: (WorkToPlan | Separator)[] = useMemo(() => {
    let currentType: WorkType = "TECH";

    const tempArray: (WorkToPlan | Separator)[] = [];
    for (const item of availableWorks) {
      if (item.type__ === currentType) {
        tempArray.push(item);
      }

      if (item.type__ !== currentType) {
        currentType = item.type__;
        tempArray.push({ type__: "separator" });
        tempArray.push(item);
      }
    }

    return tempArray;
  }, [availableWorks]);

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
            <FlatList<WorkToPlan | Separator>
              data={preparedDataToDisplay}
              renderItem={({ item }: { item: WorkToPlan | Separator }) => {
                if (isWorkToPlan(item)) {
                  return (
                    <ListItemName
                      title={item.ptc_kod}
                      id={item.prior_}
                      actionFn={setTargetWorkToPlanHandler}
                    />
                  );
                }

                if (isSeparator(item)) {
                  return (
                    <View className="flex items-center justify-center w-full mt-2 mb-6">
                      <View className="w-32 h-[2px]  bg-foreground"></View>
                    </View>
                  );
                }

                throw new Error(
                  "TargetLocalizationModal - FlatList - Unknown item type",
                );
              }}
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

function isWorkToPlan(testedObject: any): testedObject is WorkToPlan {
  return (
    typeof testedObject === "object" &&
    testedObject !== null &&
    "prior_" in testedObject &&
    "ptc_kod" in testedObject &&
    "type__" in testedObject &&
    typeof (testedObject as any).prior_ === "number" &&
    typeof (testedObject as any).ptc_kod === "string" &&
    typeof (testedObject as any).type__ === "string"
  );
}
function isSeparator(testedObject: any): testedObject is Separator {
  return (
    typeof testedObject === "object" &&
    testedObject !== null &&
    "type__" in testedObject &&
    typeof (testedObject as any).type__ === "string"
  );
}
// type Separator = { type__: "separator" };
