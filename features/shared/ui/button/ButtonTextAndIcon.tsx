import { View, Text } from "react-native";
import ButtonAsChild from "./ButtonAsChild";
import ThreeChevrons from "../icons/ThreeChevrons";
import clsx from "clsx";
import { darkColor, lightNuanceColor } from "../../constants/colorThemeVars";

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
  } = props;

  ////tsx
  return (
    <ButtonAsChild
      handlePress={actionFn}
      className={clsx(
        "flex-row items-center ",
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
          : ""
      )}
      style={customColor ? { backgroundColor: customColor } : {}}
      disabled={disabled}
    >
      <View
        className={clsx(
          "flex-row items-center justify-between  px-6",
          isFull ? "w-full" : ""
        )}
      >
        <View>
          <Text
            className={clsx(
              "font-default-bold ",
              isBackground || isBlack
                ? "text-background-nuance"
                : "text-foreground",
              disabled ? "opacity-70" : "opacity-100"
            )}
          >
            {text}
          </Text>
        </View>
        <View>{icon}</View>
      </View>
    </ButtonAsChild>
  );
};

export default ButtonTextAndIcon;
