import { View, Text } from "react-native";
import React from "react";

type TProps = {
  label: string;
  isSignedAsRequired?: boolean;
  isError?: boolean;
  disabled?: boolean;
  invert?: boolean;
};

const Label = (props: TProps) => {
  ////vars
  const {
    label,
    isSignedAsRequired = false,
    isError = false,
    disabled = false,
    invert,
  } = props;

  //
  const classNamesLabelText = ["font-default-semibold"];
  if (isError) classNamesLabelText.push("text-destructive");
  if (!isError && !invert) classNamesLabelText.push("text-background-nuance");
  if (invert && !isError) classNamesLabelText.push("text-foreground");
  if (disabled && !isError)
    classNamesLabelText.push("text-foreground opacity-30 cursor-not-allowed");

  ////tsx
  return (
    <View>
      <Text className={classNamesLabelText.join(" ")}>
        {label}
        {isSignedAsRequired ? (
          <Text className="text-destructive"> *</Text>
        ) : null}
      </Text>
    </View>
  );
};

export default Label;
