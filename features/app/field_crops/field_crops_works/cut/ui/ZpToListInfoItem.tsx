import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { View, Text } from "react-native";

type ZpWithPlanDate = { ordnmb: string; plndat: Date };
type ZpWithNitrogenIrrigationDate = {
  ordnmb: string;
  nitrogen_irrigation_date: Date;
};

type Props = {
  zpToShow: ZpWithPlanDate | ZpWithNitrogenIrrigationDate;
};

const ZpToListInfoItem = (props: Props) => {
  ////vars
  const { zpToShow } = props;
  const { renderDateInPolishWay } = useDatesHelper();

  ////tsx
  return (
    <>
      <View className="flex-row items-center justify-between w-full my-4">
        <View>
          <Text className="text-foreground font-default-semibold">
            {zpToShow.ordnmb}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="ml-6">
            <Text className="text-foreground font-default-normal">
              zlecenie na:{" "}
            </Text>
          </View>

          <View>
            <Text className="text-foreground font-default-semibold">
              {renderDateInPolishWay(
                "plndat" in zpToShow
                  ? zpToShow.plndat
                  : zpToShow.nitrogen_irrigation_date
              )}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full h-[1px] bg-foreground opacity-30"></View>
    </>
  );
};
export default ZpToListInfoItem;
