import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_POTTING,
} from "@/features/shared/types/interfaces-navigation";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { ZPInfoForPotting } from "@/features/shared/types/interfaces-zp";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { PottingInput } from "@/features/shared/types/interfaces-potting";
import { usePrepareDataForFormikToPotting } from "../domain/usePrepareDataForFormikToPotting";

type Props = {
  closeFn: () => void;
  scannedValue: ZPInfoForPotting | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetValues: () => void;
};

const TjQuantityModal = (props: Props) => {
  ////vars
  const { closeFn, scannedValue, setIsLoading, resetValues } = props;

  //extended reset values
  const extendedResetValues = () => {
    resetValues();
    closeFn();
  };

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToPotting(
      setIsLoading,
      scannedValue,
      extendedResetValues,
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
                POTTED_PLANTS,
                {
                  actionFn: closeFn,
                  name: "Doniczkowanie",
                },
                {
                  actionFn: () => {},
                  name: "Ilość doniczek",
                },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full h-full ">
            <View className="flex-col items-center justify-center flex-1 w-full">
              <View className="w-full px-6 ">
                <Text className="text-foreground font-default-normal">
                  Zlecenie:{" "}
                </Text>
                <Text className="text-foreground font-main-menu">
                  {scannedValue?.ordnmb}
                </Text>
              </View>
              <View className="w-full px-6 mt-2 mb-8">
                <Text className="text-foreground font-default-normal">
                  Ilość zdjęć:{" "}
                </Text>
                <Text className="text-foreground font-main-menu">
                  {scannedValue?.pictures?.length}
                </Text>
              </View>

              <View className="w-full px-6">
                <InputFormik<PottingInput>
                  label={`Podaj ilość doniczek:`}
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
export default TjQuantityModal;
