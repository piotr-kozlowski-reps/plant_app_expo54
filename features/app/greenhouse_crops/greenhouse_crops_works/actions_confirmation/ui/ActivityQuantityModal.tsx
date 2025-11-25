import {
  QuantityActionsConfirmation,
  ZpRozActivity,
  ZpRozActivityDetails,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuantityActionsConfirmationFormik } from "../domain/useQuantityActionsConfirmationFormik";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

type Props = {
  closeFn: () => void;
  updateQuantity: (id: number, newQuantity: number) => void;
  activityDetails: ZpRozActivityDetails | null;
  currentActivity: ZpRozActivity | null;
  zp: ZpRozWithActivities | null;
};

const ActivityQuantityModal = (props: Props) => {
  ////vars
  const { activityDetails, updateQuantity, closeFn, zp, currentActivity } =
    props;

  //formik
  const { formik, canFormBeSubmitted, availableFormActions } =
    useQuantityActionsConfirmationFormik(
      activityDetails,
      updateQuantity,
      closeFn
    );

  ////tsx
  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <KeyboardAwareScrollView
              bottomOffset={61}
              className="flex-1"
              contentContainerStyle={{ flex: 1 }}
            >
              <View className="flex-col items-center justify-between flex-1 w-full">
                <View className="w-full mt-4">
                  <Text className="text-center font-nav text-foreground">
                    Podaj ilość
                  </Text>
                  <View>
                    <View className="flex-row items-center justify-start w-full px-6 mt-4">
                      <Text className="font-default-normal text-foreground">
                        Zlecenie:{" "}
                      </Text>
                      <View className="ml-2">
                        <Text className="font-default-semibold text-foreground">
                          {zp?.ordnmb ? zp.ordnmb : "brak"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-start w-full px-6">
                      <Text className=" font-default-normal text-foreground">
                        Czynność:{" "}
                      </Text>
                      <View className="ml-2">
                        <Text className="font-default-semibold text-foreground">
                          {currentActivity?.dscrpt
                            ? currentActivity.dscrpt
                            : "brak"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-start w-full px-6">
                      <Text className=" font-default-normal text-foreground">
                        Ilość zlecenia:{" "}
                      </Text>
                      <View className="ml-2">
                        <Text className="font-default-semibold text-foreground">
                          {currentActivity?.ilebeg
                            ? currentActivity.ilebeg
                            : "brak"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="flex-col items-start justify-center flex-1 w-full px-6 mt-4">
                  <View className="w-full px-6 mt-4">
                    <Text className="font-default-normal text-foreground">
                      Czynność:{" "}
                    </Text>
                    <View>
                      <Text className="font-default-semibold text-foreground">
                        {activityDetails?.dscrpt
                          ? activityDetails.dscrpt
                          : "brak"}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full px-6 mt-4">
                    <InputFormik<QuantityActionsConfirmation>
                      label="Ilość:"
                      placeholder="podaj ilość"
                      isSignedAsRequired={true}
                      formik={formik}
                      formikField="height"
                      keyboardType="numeric"
                      isVerifiedAtOnce={true}
                    />
                  </View>
                </View>

                <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                  <View className="flex-1">
                    <ButtonTextAndThreeArrows
                      actionFn={() => availableFormActions()}
                      text="zmień"
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
      </View>
    </>
  );
};

export default ActivityQuantityModal;
