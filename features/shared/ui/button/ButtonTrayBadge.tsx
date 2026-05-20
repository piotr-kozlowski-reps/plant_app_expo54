import { Text, TouchableOpacity, View } from "react-native";
import { Tray, TrayShortInfo } from "../../types/interfaces-tray";

type Base = {
  actionFn: () => void;
  isActive?: boolean;
  isCentered?: boolean;
};

type TProps = Base &
  (
    | { isShowLacksInfo: false; tray: TrayShortInfo }
    | { isShowLacksInfo: true; tray: Tray }
  );

const ButtonTrayBadge = (props: TProps) => {
  ////vars
  const {
    tray,
    actionFn,
    isActive = true,
    isCentered,
    isShowLacksInfo,
  } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="bg-foreground py-2 rounded-app px-4 mb-2 w-[49%]"
        onPress={isActive ? () => actionFn() : undefined}
        activeOpacity={0.7}
        disabled={!isActive}
      >
        {tray ? (
          <View className="flex-col items-start justify-start w-full ">
            <Text className="w-full text-center text-background-nuance font-default-semibold">
              {tray.stk_id}
            </Text>
            {isShowLacksInfo ? (
              <>
                <View className="h-[1px] w-16 bg-background-nuance mt-2 mb-2 self-center"></View>
                <Text className="w-full text-center text-background-nuance font-default-normal">
                  ilość braków:{" "}
                  <Text className="text-background-nuance font-default-semibold">
                    {tray.lckcnt}
                  </Text>
                </Text>
              </>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    </>
  );
};

export default ButtonTrayBadge;
