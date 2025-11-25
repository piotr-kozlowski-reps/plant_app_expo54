import { TouchableOpacity, View, Text } from "react-native";
import { Localization } from "../../types/interfaces-localization";
import { ZPLocalizationInfoPlusQuantityToBeMoved } from "../../types/interfaces-zp";

type Props = {
  actionFn: () => void;
  isActive?: boolean;
  isCentered?: boolean;
  localizationInfo: ZPLocalizationInfoPlusQuantityToBeMoved | null;
  ZPId: string;
  // zpItem: ZpScannedValue;
};

const ButtonZPLocalizationBadge = (props: Props) => {
  ////vars
  const { actionFn, isActive = true, localizationInfo, ZPId } = props;

  ////tsx
  return (
    <>
      {localizationInfo ? (
        <TouchableOpacity
          className="px-8 py-2 mb-2 bg-foreground rounded-app"
          onPress={isActive ? () => actionFn() : undefined}
          activeOpacity={1}
          disabled={!isActive}
        >
          <View className="flex-col items-start justify-center w-full">
            <View className="flex-row self-center justify-center">
              <Text className="text-background-nuance font-nav">{ZPId}</Text>
            </View>

            <View className="h-[1px] w-16 bg-background-nuance mt-4 self-center"></View>

            <View className="flex-row items-end justify-start">
              <View>
                <Text className="text-background-nuance font-default-semibold">
                  lokalizacja:
                </Text>
              </View>
              <View className="mt-2 ml-2">
                <Text className="text-background-nuance font-nav">
                  {localizationInfo.dscrpt}
                </Text>
              </View>

              <View className="ml-4">
                <Text className="text-background-nuance font-default-semibold">
                  dostępna ilość:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-background-nuance font-nav">
                  {localizationInfo?.ile}
                </Text>
              </View>
            </View>

            {/* <Text className="w-full text-center text-background-nuance font-default-semibold">
            {zpItem.ordnmb}
          </Text>
          <Text className="w-full text-center text-background-nuance font-default-normal">
            ilość tac:{" "}
            <Text className="text-background-nuance font-default-semibold">
              {LocalizationInfo?.ile}
            </Text>{" "}
            z{" "}
            <Text className="text-background-nuance font-default-semibold">
              {zpItem.stkcnt_ordnmb}
            </Text>{" "}
            ({Math.round((zpItem.stkcnt_loc / zpItem.stkcnt_ordnmb) * 100)} %)
          </Text> */}
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};
export default ButtonZPLocalizationBadge;
