import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";

import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { TouchableOpacity, Text, View } from "react-native";

type Props = {
  zpValue: ZpScannedValue;
  deleteZpAction: () => void;
  isActive?: boolean;
  changeZpPercentageAction: () => void;
  canPercentageBeChanged?: boolean;
  isRoz?: boolean;
};

const ZpItem = (props: Props) => {
  ////vars
  const {
    zpValue,
    deleteZpAction,
    isActive,
    changeZpPercentageAction,
    canPercentageBeChanged = true,
    isRoz,
  } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        onPress={isActive ? () => deleteZpAction() : undefined}
      >
        <View className="flex-row items-center justify-between">
          {zpValue.planam === "BRAK" ? (
            <View className="flex-col items-start justify-start">
              <Text className="text-background-nuance font-default-semibold">
                {zpValue.ordnmb}
              </Text>
              <Text className="text-background-nuance font-default-normal">
                {ERROR_MESSAGES.NOT_FOUND_IN_LOC}
              </Text>
            </View>
          ) : null}

          {zpValue.planam !== "BRAK" && !isRoz ? (
            <View className="flex-col items-start justify-start">
              <Text className="text-background-nuance font-default-semibold">
                {zpValue.ordnmb}
              </Text>
              <Text className="text-background-nuance font-default-normal">
                ilość tac:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {zpValue.stkcnt_loc}
                </Text>{" "}
                z{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {zpValue.stkcnt_ordnmb}
                </Text>
              </Text>
            </View>
          ) : null}

          {zpValue.planam !== "BRAK" && isRoz ? (
            <View className="flex-col items-start justify-start">
              <Text className="text-background-nuance font-default-semibold">
                {zpValue.ordnmb}
              </Text>
              <Text className="text-background-nuance font-default-normal">
                ilość:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {zpValue.stkcnt_loc}
                </Text>
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center justify-start">
            <Text className="text-background-nuance font-default-semibold">{`${zpValue.act_percentage}%`}</Text>
            {/* <Button
              title={`procent: ${zpValue.act_percentage}`}
              handlePress={changeZpPercentageAction}
              isWhite
              height={42}
            /> */}
          </View>

          {/* {canPercentageBeChanged ? (
            <View className="flex-row items-center justify-start">
              <Button
                title={`procent: ${zpValue.act_percentage}`}
                handlePress={changeZpPercentageAction}
                isWhite
                height={42}
              />
            </View>
          ) : null} */}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default ZpItem;
