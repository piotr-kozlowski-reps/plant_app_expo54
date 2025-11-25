import { ZPCombinedInfo } from "@/features/shared/types/interfaces-zp";
import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  zpInfo: ZPCombinedInfo;
  actionFn: () => void;
};
const ZPItemInternalTransportOverallInfo = (props: Props) => {
  ////vars
  const { zpInfo, actionFn } = props;

  ////
  const localizations = zpInfo.localization;
  const allTracesNumber = localizations.reduce((currentValue, item) => {
    return currentValue + item.ile;
  }, 0);
  const chosenTracesNumber = localizations.reduce((currentValue, item) => {
    return currentValue + item.quantity_to_be_moved;
  }, 0);

  const isZeroTracesNumber = chosenTracesNumber === 0;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className={clsx(
          "w-full px-6 py-4 mb-2  rounded-app relative",
          isZeroTracesNumber ? "bg-destructive" : "bg-foreground"
        )}
        onPress={actionFn}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-col items-start justify-start">
            <View className="flex-row items-end justify-start">
              <View className="ml-2">
                <Text className="text-background-nuance font-nav">
                  {zpInfo.ordnmb}
                </Text>
              </View>
            </View>

            <View className="h-[1px] w-16 bg-background-nuance mt-4"></View>

            <View className="flex-row items-end justify-start mt-2">
              <View>
                <Text className="text-background-nuance font-default-semibold">
                  dostępnych:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-background-nuance font-nav">
                  {allTracesNumber}
                </Text>
              </View>
              <View className="ml-8">
                <Text className="text-background-nuance font-default-semibold">
                  zabieram:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-background-nuance font-nav">
                  {" "}
                  {chosenTracesNumber}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {isZeroTracesNumber ? (
          <View className="absolute right-2 bottom-[-12px] bg-foreground rounded-app">
            <View className="px-4 py-1">
              <Text className="text-background-nuance font-default-semibold">
                Wybrana ilość do zabrania: 0. Popraw wpis.
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    </>
  );
};
export default ZPItemInternalTransportOverallInfo;
