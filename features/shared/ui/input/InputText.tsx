import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardTypeOptions,
  BlurEvent,
} from "react-native";
import React, { useState } from "react";
import {
  darkColor,
  grayColor,
  grayColorPlaceholder,
  lightNuanceColor,
} from "../../constants/colorThemeVars";
import clsx from "clsx";
import images from "../../constants/images";
import Label from "../label/Label";

type TProps = {
  value: string;
  label?: string;
  placeholder: string;
  isError?: boolean;
  disabled?: boolean;
  isPassword?: boolean;
  isSignedAsRequired?: boolean;
  error?: string;
  height?: number;
  onChangeText: (text: string) => void;
  onBlur?: ((e: BlurEvent) => void) | undefined;
  isToBeNoticedThatIsUsed?: boolean;
  keyboardType?: KeyboardTypeOptions;
  isOnWhite?: boolean;
};

function InputText(props: TProps) {
  ////vars
  const {
    label,
    value,
    placeholder,
    isSignedAsRequired,
    isError = false,
    error,
    isPassword,
    disabled = false,
    height,
    onChangeText,
    onBlur,
    isToBeNoticedThatIsUsed,
    keyboardType,
    isOnWhite,
  } = props;

  const [showPassword, setShowPassword] = useState(() => isPassword);

  //css InputView
  const classNamesInputView = [
    "flex-row items-center w-full px-4 focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app",
  ];
  classNamesInputView.push(isOnWhite ? lightNuanceColor : "bg-[#FFB72D]");
  if (!height) classNamesInputView.push("h-custom-height");
  if (isError && !isOnWhite)
    classNamesInputView.push(
      "border border-b-destructive border-t-yellow border-l-yellow border-r-yellow"
    );
  if (isError && isOnWhite)
    classNamesInputView.push(
      "border border-b-destructive border-t-background-nuance border-l-background-nuance border-r-background-nuance"
    );
  if (!isError && !isOnWhite)
    classNamesInputView.push(
      "border-2 border-b-foreground border-l-yellow border-t-foreground border-r-yellow"
    );
  if (!isError && isOnWhite)
    classNamesInputView.push(
      "border border-b-foreground border-l-background-nuance border-t-background-nuance border-r-background-nuance"
    );

  if (disabled && !isError)
    classNamesInputView.push("text-gray opacity-50 cursor-not-allowed");
  if (!disabled && isToBeNoticedThatIsUsed)
    classNamesInputView.push("border-[3px] border-[#DC343C] bg-[#DBC2C3]");

  ////tsx
  return (
    <View className="relative flex flex-col items-start justify-start">
      {label ? (
        <View className="mb-[6px]">
          <Label
            label={label}
            isSignedAsRequired={isSignedAsRequired}
            isError={isError}
            disabled={disabled}
            invert={isOnWhite}
          />
        </View>
      ) : null}

      <View
        className={classNamesInputView.join(" ")}
        style={height ? { height: height } : {}}
      >
        <TextInput
          className={clsx("flex-1 font-input text-foreground")}
          value={value.toString()}
          placeholder={placeholder}
          placeholderTextColor={grayColorPlaceholder}
          onChangeText={onChangeText}
          secureTextEntry={showPassword}
          // textContentType={showPassword ? "none" : "password"}
          textContentType={"oneTimeCode"}
          onBlur={onBlur}
          editable={!disabled}
          keyboardType={keyboardType}
          maxLength={40}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={!showPassword ? images.eye_closed_dark : images.eye_dark}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {isError ? (
        <View className="mt-[4px]">
          <Text className="font-default-semibold text-destructive">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default InputText;
