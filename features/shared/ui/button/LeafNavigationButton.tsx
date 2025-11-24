import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  side: "left" | "right";
  actionFn: () => void;
  icon: React.ReactNode;
  name: string;
  visibility?: boolean;
  disabled?: boolean;
};
const LeafNavigationButton = (props: Props) => {
  ////vars
  const { side, icon, name, visibility = true, disabled, actionFn } = props;

  //tsx
  return (
    <>
      {visibility ? (
        <TouchableOpacity
          className={clsx(
            "w-1/2 h-[128px] shadow-2xl",
            side === "right"
              ? "rounded-br-[64px] rounded-tr-[32px] rounded-tl-[64px] rounded-bl-[4px] -mt-24"
              : "rounded-br-[4px] rounded-tr-[64px] rounded-tl-[32px] rounded-bl-[64px]",
            visibility ? "" : "opacity-0",
            disabled ? "bg-gray opacity-70" : "bg-primary"
          )}
          disabled={disabled}
          onPress={disabled ? undefined : actionFn}
          style={{ elevation: 8 }}
        >
          <View className="items-center justify-center flex-1">
            <View>{icon}</View>
            <View className="flex-row items-center justify-center w-full mt-[10px]">
              <Text className="text-center break-normal text-background font-nav">
                {name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
      {!visibility ? (
        <View
          className={clsx(
            "w-1/2 h-[128px] shadow-2xl",
            side === "right"
              ? "rounded-br-[64px] rounded-tr-[32px] rounded-tl-[64px] rounded-bl-[4px] -mt-24 opacity-0"
              : "rounded-br-[4px] rounded-tr-[64px] rounded-tl-[32px] rounded-bl-[64px] opacity-0",
            disabled ? "bg-gray opacity-70" : "bg-primary"
          )}
        ></View>
      ) : null}
    </>
  );
};

export default LeafNavigationButton;
