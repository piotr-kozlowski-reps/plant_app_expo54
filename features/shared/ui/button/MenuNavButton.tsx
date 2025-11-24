import { View, Text, TouchableOpacity } from "react-native";
import React, { ReactNode } from "react";

type TProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  disabled?: boolean;
  isGrayed?: boolean;
  isActive?: boolean;
  isBackground?: boolean;
  icon?: ReactNode;
  widthClass?: string;
  isCurrentPath?: boolean;
};

const MenuNavButton = (props: TProps) => {
  ////vars
  const {
    title,
    handlePress,
    containerStyles,
    textStyles,
    disabled,
    isGrayed,
    isBackground,
    isActive = true,
    isCurrentPath,
    icon,
    widthClass,
  } = props;

  //css InputView
  const classNamesButtonView = [
    "h-link-height justify-center items-start rounded-app",
  ];
  if (containerStyles) classNamesButtonView.push(containerStyles);
  if (disabled) classNamesButtonView.push("opacity-20 bg-gray-200");
  if (!disabled && isBackground) classNamesButtonView.push("bg-primary");
  if (isGrayed) classNamesButtonView.push("bg-[#C2C2C3]");
  if (widthClass) classNamesButtonView.push(widthClass);
  if (!widthClass) classNamesButtonView.push("w-full");
  if (isCurrentPath) classNamesButtonView.push("bg-[#2E2C32]");

  ////tsx
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={isActive ? 0.7 : 1}
      disabled={disabled}
    >
      <View className={classNamesButtonView.join(" ")}>
        <View className="flex-row items-center justify-start w-full">
          {icon ? <View className="pl-6">{icon}</View> : null}
          <Text
            className={`font-main-menu ${
              isCurrentPath ? "text-background" : "text-foreground"
            } ${textStyles} ${icon ? "px-4" : "px-6 "}`}
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuNavButton;
