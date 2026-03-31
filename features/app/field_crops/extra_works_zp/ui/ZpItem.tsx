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
  isActivityWithTj10OrTj12?: boolean;
};

const ZpItem = (props: Props) => {
  ////vars
  const {
    zpValue,
    deleteZpAction,
    isActive,
    changeZpPercentageAction,
    canPercentageBeChanged = true,
    isActivityWithTj10OrTj12 = false,
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
              {isActivityWithTj10OrTj12 ? null : (
                <Text className="text-background-nuance font-default-normal">
                  ilość tac:{" "}
                  <Text className="text-background-nuance font-default-semibold">
                    {isActivityWithTj10OrTj12
                      ? zpValue.stkcnt_ordnmb
                      : zpValue.stkcnt_loc}
                  </Text>{" "}
                  z{" "}
                  <Text className="text-background-nuance font-default-semibold">
                    {zpValue.stkcnt_ordnmb}
                  </Text>
                </Text>
              )}

              {isActivityWithTj10OrTj12 ? null : (
                <Text className="text-background-nuance font-default-normal">
                  typ tacy:{" "}
                  <Text className="text-background-nuance font-default-semibold">
                    {zpValue.trace_type ? zpValue.trace_type : "-"}
                  </Text>
                </Text>
              )}
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
              <Text className="text-background-nuance font-default-normal">
                typ tacy:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {zpValue.trace_type}
                </Text>
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center justify-start">
            <Text className="text-background-nuance font-default-semibold">{`${isActivityWithTj10OrTj12 ? 100 : zpValue.act_percentage}%`}</Text>
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
