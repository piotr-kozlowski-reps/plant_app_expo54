import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { checkOS } from "@/features/shared/utils/checkOS";
import clsx from "clsx";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { LoginInput } from "@/features/shared/types/interfaces-auth";
import Button from "@/features/shared/ui/button/Button";
import Checkbox from "expo-checkbox";
import {
  darkColor,
  primaryColor,
} from "@/features/shared/constants/colorThemeVars";
import { usePrepareDataForFormikToLogin } from "../domain/usePrepareDataForFormikToLogin";
import { useCredentialsSecureStoreHandler } from "@/features/shared/utils/useCredentialsSecureStoreHandler";
import { CustomKeyboardAvoidingView } from "@/features/shared/ui/custom-keyboard-avoiding-view/CustomKeyboardAvoidingView";

type Props = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = (props: Props) => {
  ////vars
  const { isLoading, setIsLoading } = props;
  const currentOS = checkOS();
  const {
    isRememberMe,
    formik,
    availableFormActions,
    canFormBeSubmitted,
    setIsRememberMe,
  } = usePrepareDataForFormikToLogin(setIsLoading);

  const { removeCredentialsFromSecureStore } =
    useCredentialsSecureStoreHandler(formik);

  //reset form and secure store
  const reset = async () => {
    await removeCredentialsFromSecureStore();
    formik.resetForm();
  };

  ////tsx
  return (
    <>
      <SafeAreaView className="flex-1 w-full mt-6">
        <CustomKeyboardAvoidingView
          className="flex-1 w-full"
          behavior={currentOS === "IOS" ? "padding" : "height"}
        >
          <View
            className={clsx(
              "flex-col items-center justify-start w-full  bg-yellow flex-1 rounded-tl-[96px] rounded-tr-app rounded-br-[96px] mt-6"
            )}
          >
            <View className="flex-col items-start justify-center w-full h-full pl-6">
              <View className="w-full mt-[41px] pr-6">
                <InputFormik<LoginInput>
                  label="użytkownik:"
                  placeholder="nazwa użytkownika"
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="username"
                />
              </View>

              <View className="w-full mt-[15px] pr-6">
                <InputFormik<LoginInput>
                  label="hasło:"
                  placeholder="hasło"
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="password"
                  isPassword={true}
                />
              </View>

              <View className="w-full mt-[15px] flex-row justify-between items-center">
                <TouchableOpacity
                  className="flex-row items-center justify-start"
                  onPress={() => setIsRememberMe((prevState) => !prevState)}
                  activeOpacity={0.9}
                >
                  <View>
                    <Checkbox
                      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                      className="mr-2"
                      value={isRememberMe}
                      onValueChange={setIsRememberMe}
                      color={isRememberMe ? darkColor : primaryColor}
                    />
                  </View>
                  <View className="mt-[1px]">
                    <View>
                      <Text
                        className={clsx(
                          "text-foreground ",
                          isRememberMe
                            ? "font-default-semibold"
                            : "font-default-normal"
                        )}
                      >
                        Zapamiętaj mnie
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View className="pr-6">
                  <View>
                    <Button
                      isWhite
                      handlePress={reset}
                      title="reset"
                      height={24}
                    />
                  </View>
                </View>
              </View>

              <View className="w-full mt-[52px] h-[62px] pr-6">
                <Button
                  title="Zaloguj się"
                  handlePress={availableFormActions}
                  isGrayed={!canFormBeSubmitted}
                />
              </View>
            </View>
          </View>
        </CustomKeyboardAvoidingView>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
      {/* 




 

   

              



            <View className="w-full mt-[55px] h-[62px]">
              <Button
                title="Zaloguj się"
                handlePress={availableFormActions}
                isGrayed={!canFormBeSubmitted}
              />
            </View>


          </View> */}
    </>
  );
};

export default LoginForm;
