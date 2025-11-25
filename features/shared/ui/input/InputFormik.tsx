import { BlurEvent, KeyboardTypeOptions } from "react-native";
import React from "react";
import InputText from "./InputText";
import { FormikProps } from "formik";
import { useFormikCustomHelpers } from "../../utils/useFormikCustomHelpers";

type TProps<T> = {
  label: string;
  placeholder: string;
  disabled?: boolean;
  isPassword?: boolean;
  isSignedAsRequired?: boolean;
  formik: FormikProps<T>;
  formikField: keyof T;
  keyboardType?: KeyboardTypeOptions;
  isVerifiedAtOnce?: boolean;
  isOnWhite?: boolean;
};

export default function InputFormik<T>(props: TProps<T>) {
  ////vars
  const {
    label,
    placeholder,
    disabled = false,
    isPassword,
    isSignedAsRequired,
    formik,
    formikField,
    keyboardType,
    isVerifiedAtOnce = false,
    isOnWhite = false,
  } = props;

  //formik
  const { isError, error } = useFormikCustomHelpers<T>(
    isVerifiedAtOnce,
    formik,
    formikField
  );

  ////tsx
  return (
    <InputText
      label={label}
      value={formik.values[formikField] as string}
      placeholder={placeholder}
      isSignedAsRequired={isSignedAsRequired}
      isError={isError}
      error={error as string}
      isPassword={isPassword}
      disabled={disabled}
      onChangeText={formik.handleChange(formikField)}
      onBlur={
        formik.handleBlur(formikField) as ((e: BlurEvent) => void) | undefined
      }
      keyboardType={keyboardType}
      isOnWhite={isOnWhite}
    />
  );
}
