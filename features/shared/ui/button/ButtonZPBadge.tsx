import { Text, TouchableOpacity, View } from "react-native";
import { ERROR_MESSAGES } from "../../utils/messages";
import { ZpScannedValue } from "../../types/interfaces-extra_works";

type TProps = {
  actionFn: () => void;
  isActive?: boolean;
  isCentered?: boolean;
  zpItem: ZpScannedValue;
};

const ButtonZPBadge = (props: TProps) => {
  ////vars
  const { zpItem, actionFn, isActive = true, isCentered } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="bg-foreground py-2 rounded-app px-4 mb-2 w-[49%]"
        onPress={isActive ? () => actionFn() : undefined}
        activeOpacity={0.7}
        disabled={!isActive}
      >
        {zpItem.planam === "BRAK" ? (
          <View className="flex-col items-start justify-start w-full">
            <Text className="w-full text-center text-background-nuance font-default-semibold">
              {zpItem.ordnmb}
            </Text>
            <Text className="w-full text-center text-background-nuance font-default-normal">
              {ERROR_MESSAGES.NOT_FOUND_IN_LOC}
            </Text>
          </View>
        ) : null}

        {zpItem.planam !== "BRAK" ? (
          <View className="flex-col items-start justify-start w-full ">
            <Text className="w-full text-center text-background-nuance font-default-semibold">
              {zpItem.ordnmb}
            </Text>
            <Text className="w-full text-center text-background-nuance font-default-normal">
              ilość tac:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {zpItem.stkcnt_loc}
              </Text>{" "}
              z{" "}
              <Text className="text-background-nuance font-default-semibold">
                {zpItem.stkcnt_ordnmb}
              </Text>{" "}
              ({Math.round((zpItem.stkcnt_loc / zpItem.stkcnt_ordnmb) * 100)} %)
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </>
  );
};

export default ButtonZPBadge;
