import { View, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";
import { primaryColor } from "../../constants/colorThemeVars";

type TProps = {
  icon: React.ReactNode;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  disabled?: boolean;
  isGrayed?: boolean;
  isOutline?: boolean;
  isOnlyIcon?: boolean;
  outlineColor?: string;
  backgroundColorWithHash?: string;
  size?: number;
  marginLeft?: number;
};

const ButtonIcon = (props: TProps) => {
  ////vars
  const {
    icon,
    handlePress,
    containerStyles,
    textStyles,
    disabled,
    isGrayed,
    isOutline = false,
    isOnlyIcon = false,
    outlineColor,
    backgroundColorWithHash,
    size,
    marginLeft,
  } = props;

  ////tsx
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        className={clsx(
          "flex-row w-[48px] h-[48px] justify-between items-center px-[12px]",
          (!isOutline && disabled) || isGrayed ? "opacity-50 bg-gray" : "",
          disabled && isOutline ? "opacity-50 border-gray" : "",
          isOutline ? "border-2 rounded-app" : "bg-primary",
          // isOutline && outlineColorClass ? outlineColorClass : "border-primary",
          isOnlyIcon ? "border-none bg-transparent" : ""
        )}
        style={
          backgroundColorWithHash
            ? {
                backgroundColor: backgroundColorWithHash,
                width: size ? size : 48,
                height: size ? size : 48,
              }
            : {
                width: size ? size : 48,
                height: size ? size : 48,
                paddingLeft: marginLeft ? marginLeft : 12,
                borderColor: outlineColor ? primaryColor : outlineColor,
              }
        }
      >
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default ButtonIcon;
