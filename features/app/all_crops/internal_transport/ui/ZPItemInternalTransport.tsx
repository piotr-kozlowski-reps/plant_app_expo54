import {
  ZPLocalizationInfo,
  ZPLocalizationInfoPlusQuantityToBeMoved,
} from "@/features/shared/types/interfaces-zp";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  localization: ZPLocalizationInfoPlusQuantityToBeMoved;
  actionFn: () => void;
};

const ZPItemInternalTransport = (props: Props) => {
  ////vars
  const { localization, actionFn } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        onPress={actionFn}
      >
        <View className="flex-row items-center justify-between pb-1">
          <View className="flex-col items-start justify-start">
            <View className="flex-row items-end justify-start">
              <View>
                <Text className="text-background-nuance font-default-semibold">
                  lokalizacja:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-background-nuance font-nav">
                  {localization.dscrpt}
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
                  {localization.ile}
                </Text>
              </View>
              <View className="ml-8">
                <Text className="text-background-nuance font-default-semibold">
                  zabieram:
                </Text>
              </View>
              <BadgeValueHighlighted
                value={localization.quantity_to_be_moved}
              />
            </View>
          </View>

          {/* <View className="flex-row items-center justify-start">
                  <Text className="text-background-nuance font-default-semibold">{`${zpValue.act_percentage}%`}</Text>

                </View> */}
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ZPItemInternalTransport;
