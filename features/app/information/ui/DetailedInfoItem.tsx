import { InformationDTO } from "@/features/shared/types/interfaces-information";
import clsx from "clsx";
import { View, Text } from "react-native";

type Props = {
  item: InformationDTO;
  index: number;
};

const DetailedInfoItem = (props: Props) => {
  ////vars
  const { item, index } = props;

  //
  const isItemWeekMainNumber = item.label === "TYDZIEŃ WYJAZDU";
  const isItemExtraWorksLabel = item.prior === "10000";
  const isRegularItem = !isItemWeekMainNumber && !isItemExtraWorksLabel;

  ////tsx
  return (
    <>
      {isItemWeekMainNumber ? (
        <View
          className={clsx(
            "w-full flex-col justify-end",
            index === 0 ? "mb-8 h-8" : "h-[96px] mb-8"
          )}
        >
          <View className="flex-row items-center justify-start w-full">
            <View>
              <Text className="underline text-foreground font-nav">
                {item.label}
                {":"}
              </Text>
            </View>
            <View className="ml-2 ">
              <Text className="text-foreground font-title">{item.value}</Text>
            </View>
          </View>
        </View>
      ) : null}
      {isItemExtraWorksLabel ? (
        <View
          className={clsx(
            "w-full flex-col justify-end",
            index === 0 ? "mb-8 h-8" : "h-[96px] mb-8"
          )}
        >
          <View className="w-full h-[8px] bg-foreground mb-[18px]"></View>
          <View className="flex-row items-center justify-start w-full">
            <View>
              <Text className="text-foreground font-nav">
                {item.label}
                {":"}
              </Text>
            </View>
            <View className="ml-2 ">
              <Text className="text-foreground font-title">{item.value}</Text>
            </View>
          </View>
        </View>
      ) : null}
      {isRegularItem ? (
        <View className="w-full mb-4">
          <View>
            <View className="w-full h-[1px] bg-foreground mb-[18px]"></View>
            <View className="flex-col items-start justify-start">
              <View>
                <Text className="font-normal text-foreground text-wrap">
                  {item.label}
                  {":"}
                </Text>
              </View>

              <View className="mt-1 ml-4">
                <Text className="text-foreground font-nav">{item.value}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : // <View className="flex-col items-start justify-start w-full h-[48px] mb-2">
      //   <View className="w-full h-[1px] bg-foreground mb-[18px]"></View>
      //   <View className="flex-row items-center justify-start">
      //     <View>
      //       <Text className="font-normal text-foreground">
      //         {item.label}
      //         {":"}
      //       </Text>
      //     </View>
      //     <View className="ml-2">
      //       <Text className="text-foreground font-nav">{item.value}</Text>
      //     </View>
      //   </View>

      // </View>
      null}
    </>
  );
};
export default DetailedInfoItem;
