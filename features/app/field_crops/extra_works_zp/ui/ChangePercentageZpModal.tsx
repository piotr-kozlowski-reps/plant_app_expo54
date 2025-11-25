import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import {
  ZpScannedValue,
  ZpScannedValuePercentage,
} from "@/features/shared/types/interfaces-extra_works";
import Button from "@/features/shared/ui/button/Button";
import ButtonZPBadge from "@/features/shared/ui/button/ButtonZPBadge";
import { View, Text } from "react-native";
import { usePrepareDataForFormikToChangePercentage } from "../domain/usePrepareDataForFormikToChangePercentage";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

type Props = {
  closeFn: () => void;
  zpItem: ZpScannedValue | undefined;
  actionFn: (zpValue: ZpScannedValue) => void;
};

const ChangePercentageZpModal = (props: Props) => {
  ////vars
  const { closeFn, zpItem, actionFn } = props;

  if (!zpItem) {
    throw new Error("ChangePercentageZpModal - No ZP Item provided");
  }

  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToChangePercentage(zpItem, closeFn, actionFn);

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <KeyboardAwareScrollView
        bottomOffset={61}
        className="flex-1"
        contentContainerStyle={{ flex: 1 }}
      >
        <View className="relative flex-col items-center justify-center flex-1 ">
          <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
            <View className="flex items-center justify-center w-full ">
              <Text className="text-center text-foreground font-euclid_semibold">
                Zmień procent wykonania zlecenia?
              </Text>
            </View>
            <View className="flex items-center justify-center w-full mt-2">
              <ButtonZPBadge zpItem={zpItem} actionFn={() => {}} isCentered />
            </View>

            <View className="w-full px-6 mt-16 mb-8">
              <InputFormik<ZpScannedValuePercentage>
                label="Procent wykonania:"
                placeholder="podaj procent wykonania"
                isSignedAsRequired={true}
                formik={formik}
                formikField="act_percentage"
                keyboardType="numeric"
                isVerifiedAtOnce={true}
              />
            </View>

            <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
              <View>
                <Button
                  title="zmień"
                  handlePress={() => availableFormActions()}
                  disabled={!canFormBeSubmitted}
                />
              </View>
              <View>
                <Button title="powrót" handlePress={closeFn} isOutline />
              </View>
              <View></View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar doneText={"gotowe"} />
    </View>
  );
};
export default ChangePercentageZpModal;
