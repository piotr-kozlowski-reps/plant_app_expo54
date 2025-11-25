import { View, Text } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { ZPLocalizationInfoPlusQuantityToBeMoved } from "@/features/shared/types/interfaces-zp";

import InputFormik from "@/features/shared/ui/input/InputFormik";
import { useZpInternalTransportQuantityFormik } from "../domain/useZpInternalTransportQuantityFormik";
import { QuantityPerLocalizationInput } from "@/features/shared/types/interfaces-localization";
import Button from "@/features/shared/ui/button/Button";
import ButtonZPLocalizationBadge from "@/features/shared/ui/button/ButtonZPLocalizationBadge";

type Props = {
  closeFn: () => void;
  localization: ZPLocalizationInfoPlusQuantityToBeMoved | null;
  ZPId: string;
  changeQuantityHandler: (
    localizationWithNewQuantity: ZPLocalizationInfoPlusQuantityToBeMoved
  ) => void;
};

const ChangeQuantityForInternalTransportModal = (props: Props) => {
  ////vars
  const { closeFn, localization, ZPId, changeQuantityHandler } = props;

  const { formik, availableFormActions, canFormBeSubmitted } =
    useZpInternalTransportQuantityFormik(
      closeFn,
      localization?.ile || 0,
      localization,
      changeQuantityHandler
    );

  ////tsx
  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <KeyboardAwareScrollView
          bottomOffset={61}
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
        >
          <View className="relative flex-col items-center justify-center flex-1">
            <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
              <View className="flex items-center justify-center w-full ">
                <Text className="text-center text-foreground font-euclid_semibold">
                  Zabieram z lokalizacji:
                </Text>
              </View>
              <View className="flex items-center justify-center w-full mt-2">
                <ButtonZPLocalizationBadge
                  localizationInfo={localization}
                  actionFn={() => {}}
                  ZPId={ZPId}
                />
              </View>

              <View className="w-full px-6 mt-16">
                <InputFormik<QuantityPerLocalizationInput>
                  label="Podaj ilość:"
                  placeholder="podaj ilość"
                  isSignedAsRequired={true}
                  formik={formik}
                  formikField="qntity"
                  keyboardType="numeric"
                  isVerifiedAtOnce={true}
                />
              </View>

              <View className="flex-col justify-center w-full gap-4 px-6 mt-16 items-between">
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
    </>
  );
};
export default ChangeQuantityForInternalTransportModal;
