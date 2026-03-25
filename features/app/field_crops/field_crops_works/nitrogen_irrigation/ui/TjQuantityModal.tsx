import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  INDEX,
  EXTRA_WORKS_HOBBY,
  EXTRA_WORKS_HOBBY_TECHNOLOGY,
} from "@/features/shared/types/interfaces-navigation";
import {
  ExtraWork,
  ExtraWorkTj12QuantityInput,
} from "@/features/shared/types/interfaces-extra_works";
import { usePrepareDataForFormikToTjQuantity } from "../domain/usePrepareDataForFormikToTjQuantity";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import React from "react";
import InputFormik from "@/features/shared/ui/input/InputFormik";

type Props = {
  //   protectiveTreatments: ProtectiveTreatment[];
  //   isLoading: boolean;
  closeFn: () => void;
  changeTj12Quantity: (value: number) => void;
  extraWork: ExtraWork | undefined;
  tjQuantity: number | null;
  isActivityIdHobbyWithTj10: boolean;
  isActivityIdHobbyWithTj12: boolean;
  //   refreshAllData: () => void;
  //   changeProtectiveTreatment: (protectiveTreatment: ProtectiveTreatment) => void;
};

const TjQuantityModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    changeTj12Quantity,
    extraWork,
    tjQuantity,
    isActivityIdHobbyWithTj10,
    isActivityIdHobbyWithTj12,
  } = props;

  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToTjQuantity(
      changeTj12Quantity,
      closeFn,
      tjQuantity,
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
                EXTRA_WORKS_HOBBY,
                EXTRA_WORKS_HOBBY_TECHNOLOGY,
                {
                  actionFn: () => {},
                  name: "Prace Extra HOBBY - ZP",
                },
                {
                  actionFn: () => {},
                  name: "Ilość TJ",
                },
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
              </View>

              <View className="w-full px-6">
                <InputFormik<ExtraWorkTj12QuantityInput>
                  label={`Podaj ilość ${isActivityIdHobbyWithTj12 ? "TJ12" : "TJ10"}:`}
                  placeholder={`podaj ilość ${isActivityIdHobbyWithTj12 ? "TJ12" : "TJ10"}`}
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="quantity"
                  keyboardType="numeric"
                  isVerifiedAtOnce={true}
                />
              </View>
            </View>

            <View className="w-full px-6 mt-4 mb-4">
              <ButtonTextAndThreeArrows
                actionFn={() => availableFormActions()}
                text="zatwierdź"
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
export default TjQuantityModal;
