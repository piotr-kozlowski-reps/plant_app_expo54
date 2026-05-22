import { View, Text, StyleProp, ViewStyle } from "react-native";
import ButtonAsChild from "./ButtonAsChild";
import clsx from "clsx";

type Props = {
  actionFn: () => void;
  text: string;
  icon: React.ReactNode;
  isBackground?: boolean;
  disabled?: boolean;
  isFull?: boolean;
  customColor?: string;
  isBlack?: boolean;
  isWhite?: boolean;
  width?: number;
};

const ButtonTextAndIcon = (props: Props) => {
  ////vars
  const {
    actionFn,
    text,
    isBackground = false,
    disabled,
    icon,
    isFull = true,
    customColor,
    isBlack,
    isWhite,
    width,
  } = props;

  let customStyles: StyleProp<ViewStyle> = {};
  if (customColor) customStyles.backgroundColor = customColor;
  if (width) customStyles.width = width;

  ////tsx
  return (
    <ButtonAsChild
      handlePress={actionFn}
      className={clsx(
        "flex-row items-center",
        isBackground && !disabled && !isWhite && !isBlack
          ? "justify-center bg-foreground rounded-app h-[64px]"
          : "justify-end h-[48px]",
        disabled && isBackground
          ? "bg-gray rounded-app h-[64px] justify-center opacity-80"
          : "",
        isFull ? "w-full " : "",
        isBlack ? "bg-foreground justify-center rounded-app h-[64px]" : "",
        isWhite
          ? "bg-background-nuance justify-center rounded-app h-[64px]"
          : "",
      )}
      style={customStyles}
      disabled={disabled}
    >
      <View
        className={clsx(
          "flex-row items-center justify-between  px-6 relative",
          isFull ? "w-full" : "",
        )}
      >
        <View className="w-[80%]">
          <Text
            className={clsx(
              "font-default-bold ",
              isBackground || isBlack
                ? "text-background-nuance"
                : "text-foreground",
              disabled ? "opacity-70" : "opacity-100",
            )}
          >
            {text}
          </Text>
        </View>
        <View className="absolute right-6">{icon}</View>
      </View>
    </ButtonAsChild>
  );
};

export default ButtonTextAndIcon;
