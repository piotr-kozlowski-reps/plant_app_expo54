import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_COTYLEDON_QUILTING,
} from "@/features/shared/types/interfaces-navigation";
import { Tray, TrayShortInfo } from "@/features/shared/types/interfaces-tray";
import {
  CotyledonQuilting,
  QuantityForCotyledonQuiltingInput,
} from "@/features/shared/types/interfaces-cotyledon_quilting";
import React from "react";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { usePrepareDataForFormikToCotyledonQuiltingQuantity } from "../domain/usePrepareDataForFormikToCotyledonQuiltingQuantity";

type TProps = {
  closeFn: () => void;
  ordnmb: string | null;
  chosenColor: CotyledonQuilting | null;
  trays: TrayShortInfo[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CotyledonQuilting_QuantityAndSend_Modal = (props: TProps) => {
  ////vars
  const { closeFn, ordnmb, chosenColor, trays, setIsLoading } = props;

  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToCotyledonQuiltingQuantity(
      setIsLoading,
      closeFn,
      trays,
      chosenColor,
    );

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
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
                POTTED_PLANTS,
                POTTED_PLANTS_COTYLEDON_QUILTING,
                { actionFn: closeFn, name: "Skanuj tace" },
                { actionFn: () => {}, name: "Podaj ilość" },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full h-full ">
            <View className="flex-col items-center justify-center flex-1 w-full">
              <View className="flex-col items-center justify-center w-full">
                <View>
                  <Text className="font-title">{ordnmb ? ordnmb : "-"}</Text>
                </View>
              </View>

              <View className="flex-col items-center justify-center w-full px-6 mt-4">
                <Text className=" font-default-normal text-foreground">
                  kolor:{" "}
                </Text>
                <View className="ml-2">
                  <Text className="font-default-semibold text-foreground">
                    {chosenColor?.twr_nazwa}
                  </Text>
                </View>
              </View>

              <View className="flex-col items-center justify-center w-full px-6 mt-4">
                <Text className=" font-default-normal text-foreground">
                  tace:{" "}
                </Text>
                {trays.map((tray) => (
                  <View className="ml-2" key={tray.stk_id}>
                    <Text className="font-default-semibold text-foreground">
                      {tray.stk_id}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="w-full px-6 mt-8">
                <InputFormik<QuantityForCotyledonQuiltingInput>
                  label={`Podaj ilość:`}
                  placeholder="podaj ilość"
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="quantity"
                  keyboardType="numeric"
                  isVerifiedAtOnce={true}
                />
              </View>
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={() => availableFormActions()}
                  text="wyślij"
                  isBackground
                  disabled={!canFormBeSubmitted}
                />
              </View>
              <View className="ml-6">
                <ButtonBack actionFn={closeFn} isOutline={false} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} />
      </SafeAreaView>
    </View>
  );
};

export default CotyledonQuilting_QuantityAndSend_Modal;
