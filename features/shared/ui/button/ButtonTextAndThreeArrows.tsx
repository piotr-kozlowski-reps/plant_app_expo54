import { View, Text } from "react-native";
import ButtonAsChild from "./ButtonAsChild";
import ThreeChevrons from "../icons/ThreeChevrons";
import clsx from "clsx";
import { darkColor, lightNuanceColor } from "../../constants/colorThemeVars";

type Props = {
  actionFn: (() => Promise<void>) | (() => void);
  text: string;
  isBackground?: boolean;
  disabled?: boolean;
  color?: string;
};

const ButtonTextAndThreeArrows = (props: Props) => {
  ////vars
  const { actionFn, text, isBackground = false, disabled, color } = props;

  ////tsx
  return (
    <ButtonAsChild
      handlePress={actionFn}
      className={clsx(
        "flex-row w-full items-center",
        isBackground && !disabled
          ? "justify-center bg-primary rounded-app h-[64px]"
          : "justify-end h-[48px]",
        disabled && isBackground
          ? "bg-gray rounded-app h-[64px] justify-center opacity-80"
          : ""
      )}
      disabled={disabled}
      style={color ? { backgroundColor: color } : undefined}
    >
      <View className="flex-row items-center">
        <Text
          className={clsx(
            "font-default-bold ",
            isBackground ? "text-background-nuance" : "text-foreground",
            disabled ? "opacity-70" : "opacity-100"
          )}
        >
          {text}
        </Text>
        <ThreeChevrons
          color={isBackground ? lightNuanceColor : darkColor}
          opacity={disabled ? 70 : 100}
        />
      </View>
    </ButtonAsChild>
  );
};

export default ButtonTextAndThreeArrows;
