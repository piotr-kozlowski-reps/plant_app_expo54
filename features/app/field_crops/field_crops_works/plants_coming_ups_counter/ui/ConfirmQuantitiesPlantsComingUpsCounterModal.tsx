import { Tray } from "@/features/shared/types/interfaces-tray";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { View, Text } from "react-native";
import { useConfirmQuantitiesPlantsComingUpsCounterFormik } from "../domain/useConfirmQuantitiesPlantsComingUpsCounterFormik";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { darkColor } from "@/features/shared/constants/colorThemeVars";
import { Minus, Plus } from "lucide-react-native";
import Button from "@/features/shared/ui/button/Button";

type Props = {
  closeFn: () => void;
  tray: Tray | null;
  addOrChangeQuantityInPlantsComingUpsCounterHandler: (tray: Tray) => void;
};

const ConfirmQuantitiesPlantsComingUpsCounterModal = (props: Props) => {
  ////vars
  const { tray, closeFn, addOrChangeQuantityInPlantsComingUpsCounterHandler } =
    props;

  if (!tray) {
    throw new Error(
      "ConfirmQuantitiesPlantsComingUpsCounterModal -> tray is null"
    );
  }

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    useConfirmQuantitiesPlantsComingUpsCounterFormik(
      closeFn,
      tray,
      addOrChangeQuantityInPlantsComingUpsCounterHandler
    );

  //helpers
  const changeQuantityValue = (value: number) => {
    formik
      .getFieldHelpers("lckcnt")
      .setValue(Number.parseInt(formik.getFieldMeta("lckcnt").value) + value);
  };

  ////tsx
  return (
    <>
      {!tray ? (
        <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
          <View className="relative flex-col items-center justify-center flex-1">
            <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app px-8">
              <View className="flex items-center justify-center w-full ">
                <Text className="text-center text-foreground font-euclid_semibold">
                  Brak informacji o zleceniu!
                </Text>
              </View>
              <View>
                <Button title="powrót" handlePress={closeFn} isOutline />
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {tray ? (
        <>
          <KeyboardAwareScrollView
            bottomOffset={61}
            className="flex-1"
            contentContainerStyle={{ flex: 1 }}
          >
            <View className="absolute left-0 right-0 w-full bottom-8 top-8">
              <View className="relative flex-col items-center justify-center flex-1">
                <View className="w-full flex-1 pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app ">
                  <View className="flex items-center justify-center w-full px-8">
                    <Text className="text-center text-foreground font-nav">
                      Braki
                    </Text>
                  </View>
                  <View className="px-8">
                    <View className="mt-[24px]">
                      <Text className="text-foreground font-default-normal">
                        Taca:{" "}
                        <Text className="font-nav text-foreground">
                          {tray.stk_id}
                        </Text>
                      </Text>
                    </View>
                    <View className="">
                      <Text className="text-foreground font-default-normal">
                        Zlecenie:{" "}
                        <Text className="font-nav text-foreground">
                          {tray.ordnmb}
                        </Text>
                      </Text>
                    </View>
                    <View className="">
                      <Text className="text-foreground font-default-normal">
                        Kod:{" "}
                        <Text className="font-nav text-foreground">
                          {tray.twrkod}
                        </Text>
                      </Text>
                    </View>
                    <View className="">
                      <Text className="text-foreground font-default-normal">
                        Produkt:{" "}
                        <Text className="font-nav text-foreground">
                          {tray.twrnzw}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View className="px-8 mt-6">
                    {/* <View>
                      <Text className="text-foreground font-default-normal">
                        podaj ilość braków:
                      </Text>
                    </View> */}
                  </View>
                  <View className="flex-row items-start justify-between flex-1 w-full gap-4 px-6 mt-16">
                    <View className="mt-[24px] w-[62px]">
                      <ButtonIcon
                        handlePress={() => changeQuantityValue(-1)}
                        icon={
                          <Minus size={24} color={darkColor} strokeWidth={3} />
                        }
                        size={62}
                        isOutline
                        marginLeft={16}
                      />
                    </View>

                    <View className="flex-1">
                      <InputFormik<Tray>
                        label="Podaj ilość:"
                        placeholder="podaj ilość"
                        isSignedAsRequired={true}
                        formik={formik}
                        formikField="lckcnt"
                        keyboardType="numeric"
                        isVerifiedAtOnce={true}
                      />
                    </View>
                    <View className="mt-[24px]">
                      <ButtonIcon
                        handlePress={() => changeQuantityValue(1)}
                        icon={
                          <Plus size={24} color={darkColor} strokeWidth={3} />
                        }
                        size={62}
                        isOutline
                        marginLeft={16}
                      />
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between w-full pl-6 mt-6 mb-[16px]">
                    <View className="flex-1">
                      <ButtonTextAndThreeArrows
                        actionFn={availableFormActions}
                        text="dodaj"
                        isBackground
                        disabled={!canFormBeSubmitted}
                      />
                    </View>
                    <View className="ml-6">
                      <ButtonBack actionFn={closeFn} isOutline={false} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <KeyboardToolbar doneText={"gotowe"} />
        </>
      ) : null}
    </>
  );
};

export default ConfirmQuantitiesPlantsComingUpsCounterModal;
