import { ZpScannedValueForLoading } from "@/features/shared/types/interfaces-loading";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  zpInfo: ZpScannedValueForLoading;
  deleteAction: (zp: ZpScannedValueForLoading) => void;
};

const ZpInfoForLoading = (props: Props) => {
  ////vars
  const { zpInfo, deleteAction } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        onPress={() => deleteAction(zpInfo)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-col items-start justify-start">
            <Text className="text-background-nuance font-default-semibold">
              {zpInfo.ordnmb}
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Nazwa:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {zpInfo.twrnzw}
              </Text>
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Tace do załadunku:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {zpInfo.outcnt}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ZpInfoForLoading;
