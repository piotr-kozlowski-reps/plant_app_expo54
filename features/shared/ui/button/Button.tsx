import { TouchableOpacity, Text, View, DimensionValue } from "react-native";
import React from "react";
import { clsx } from "clsx";
import {
  darkColor,
  grayColor,
  lightColor,
  lightNuanceColor,
  primaryColor,
  yellowColor,
} from "../../constants/colorThemeVars";

type TProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  disabled?: boolean;
  isGrayed?: boolean;
  isInvert?: boolean;
  isOutline?: boolean;
  isWhite?: boolean;
  isBlack?: boolean;
  bgColor?: string;
  height?: number;
  width?: DimensionValue;
  isBigText?: boolean;
};

const Button = (props: TProps) => {
  ////vars
  const {
    title,
    handlePress,
    containerStyles,
    textStyles,
    disabled,
    isGrayed,
    isInvert,
    isOutline,
    height,
    width,
    isWhite,
    bgColor,
    isBlack,
    isBigText,
  } = props;

  let backgroundColor = "";
  if (!isGrayed && isOutline) backgroundColor = yellowColor;
  if (!isGrayed && !isOutline) backgroundColor = primaryColor;
  if (!isGrayed && !isOutline && isWhite) backgroundColor = lightNuanceColor;
  if (!isGrayed && !disabled && bgColor) backgroundColor = bgColor;
  if (isGrayed || disabled) backgroundColor = grayColor;
  if (!isGrayed && !disabled && isBlack) backgroundColor = darkColor;

  let textColor = "";
  if (!isGrayed && isOutline) textColor = darkColor;
  if (!isGrayed && !isOutline) textColor = lightNuanceColor;
  if (!isGrayed && !isOutline && isWhite) textColor = darkColor;
  if (isGrayed || disabled) textColor = lightNuanceColor;

  ////tsx
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        className={clsx(
          "w-full  justify-center items-center rounded-app",
          (disabled || isGrayed) && !isInvert ? "opacity-80 bg-gray" : "",
          isInvert && !disabled && !isGrayed
            ? "bg-background-nuance"
            : "bg-primary",
          isOutline ? "border-[2px] border-primary" : "border-none",
          height ? "" : "h-custom-height",
          containerStyles
        )}
        style={{
          backgroundColor: backgroundColor,
          height: height ? height : 62,
          width: width ? width : undefined,
        }}
      >
        <Text
          className={clsx(
            "px-6  opacity-100",
            isBigText ? "font-nav" : "font-default-semibold",
            // isInvert ? "text-foreground" : "text-background",
            textStyles
          )}
          style={{
            color: textColor,
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
