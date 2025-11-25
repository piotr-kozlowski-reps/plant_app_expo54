// import { TrayScannedValueForMovingToGarden } from "@/features/shared/types/interfaces-move_to_garden";
import { View, Text, TouchableOpacity } from "react-native";

import { TrayScannedValueForAddToZp } from "@/features/shared/types/interface-add_to_zp";

type Props = {
  index: number;
  tray: TrayScannedValueForAddToZp;
  deleteAction: (tray: TrayScannedValueForAddToZp) => void;
};

const TrayInfoForAddToZp = (props: Props) => {
  ////vars
  const { tray, deleteAction, index } = props;

  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        onPress={() => deleteAction(tray)}
      >
        <View className="flex-row items-center justify-between">
          <View className="mr-4">
            <Text className="text-background-nuance font-default-semibold">
              {index + 1}.
            </Text>
          </View>
          <View className="flex-col items-start justify-start flex-1">
            <Text className="text-background-nuance font-default-semibold">
              {tray.stk_id}
            </Text>
            <View className="w-full mt-1 mb-1">
              <View className="w-24 h-[1px] bg-background-nuance"></View>
            </View>
            <Text className="text-background-nuance font-default-normal">
              ZP:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {tray.ordnmb}
              </Text>
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Nazwa:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {tray.twrnzw}
              </Text>
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Kod:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {tray.twrkod}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default TrayInfoForAddToZp;
