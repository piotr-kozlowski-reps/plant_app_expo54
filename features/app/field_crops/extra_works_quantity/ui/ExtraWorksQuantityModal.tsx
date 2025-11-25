import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExtraWork,
  ExtraWorkQuantityInput,
} from "@/features/shared/types/interfaces-extra_works";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import React from "react";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  INDEX,
  QUANTITY_FORM,
} from "@/features/shared/types/interfaces-navigation";
import { usePrepareDataForFormikToExtraWorkQuantity } from "../domain/usePrepareDataForFormikToExtraWorkQuantity";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useCheckIfExtraWorkWasDoneToday } from "../domain/useCheckIfExtraWorkWasDoneToday";

type TProps = {
  closeFn: () => void;
  extraWork: ExtraWork | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExtraWorksQuantityModal = (props: TProps) => {
  ////vars
  const { closeFn, extraWork, setIsLoading } = props;

  const { todaysQuantity } = useCheckIfExtraWorkWasDoneToday(
    setIsLoading,
    extraWork
  );

  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToExtraWorkQuantity(
      setIsLoading,
      extraWork,
      closeFn
    );

  ////tsx
  return (
    <View className="items-center justify-center flex-1 w-full h-full bg-yellow">
      <SafeAreaView className="flex-1 w-full">
        <KeyboardAwareScrollView
          bottomOffset={61}
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
        >
          <View className="w-full px-6 mt-8 ">
            <AppPath
              paths={[
                INDEX,
                FIELD_CROPS,
                { name: "Prace Extra - Ilości", actionFn: closeFn },
                QUANTITY_FORM,
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full h-full ">
            <View className="flex-col items-center justify-center flex-1 w-full">
              <View className="w-full px-6 mb-16">
                <Text className="text-foreground font-default-normal">
                  Praca extra:{" "}
                </Text>
                <Text className="text-foreground font-main-menu">
                  {extraWork?.activityname}
                </Text>
                {todaysQuantity > 0 ? (
                  <View className="mt-2">
                    <Text className="text-destructive font-default-normal">
                      Praca extra była już dziś wykonana.
                    </Text>
                    <Text className="text-destructive font-default-normal">
                      Ilość:{" "}
                      <Text className="text-destructive font-default-bold">
                        {todaysQuantity}
                      </Text>
                      <Text className="text-destructive font-default-normal">
                        {" "}
                        szt.
                      </Text>
                    </Text>
                  </View>
                ) : null}
              </View>

              <View className="w-full px-6">
                <InputFormik<ExtraWorkQuantityInput>
                  label="Ilość:"
                  placeholder="podaj ilość"
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="qntity"
                  keyboardType="numeric"
                  isVerifiedAtOnce={true}
                />
              </View>
            </View>

            <View className="w-full px-6 mt-4 mb-4">
              <ButtonTextAndThreeArrows
                actionFn={() => availableFormActions()}
                text="wyślij"
                isBackground
                disabled={!canFormBeSubmitted}
              />
            </View>
            <View className="w-full mb-4">
              <ButtonBack actionFn={closeFn} isOutline={false} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} />
      </SafeAreaView>
    </View>
  );
};

export default ExtraWorksQuantityModal;
