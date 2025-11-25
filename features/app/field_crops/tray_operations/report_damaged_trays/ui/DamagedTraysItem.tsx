import { ReportDamagedTrays } from "@/features/shared/types/interfaces-report_damaged_trays";
import { View, Text } from "react-native";

type Props = {
  tray: ReportDamagedTrays;
};

const DamagedTraysItem = (props: Props) => {
  ////vars
  const { tray } = props;

  return (
    <>
      <View className="flex-col items-start justify-center w-full my-4">
        <View>
          <Text className="text-foreground font-default-semibold">
            {tray.stk_id}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="">
            <Text className="text-foreground font-default-normal">
              Wprowadził{" "}
            </Text>
          </View>

          <View>
            <Text className="text-foreground font-default-semibold">
              {tray.usrnam}{" "}
            </Text>
          </View>

          <View className="">
            <Text className="text-foreground font-default-normal">dnia </Text>
          </View>

          <View>
            <Text className="text-foreground font-default-semibold">
              {tray.dstdat}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full h-[1px] bg-foreground opacity-30"></View>
    </>
  );
};

export default DamagedTraysItem;
