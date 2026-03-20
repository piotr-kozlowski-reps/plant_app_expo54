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
import { usePrepareDataForFormikToTj12Quantity } from "../domain/usePrepareDataForFormikToTj12Quantity";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import React from "react";
import InputFormik from "@/features/shared/ui/input/InputFormik";
// import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
// import { NitrogenConcentrationKeyValue } from "@/features/shared/types/interfaces-general";
// import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
// import { FlatList, RefreshControl } from "react-native-gesture-handler";

type Props = {
  //   protectiveTreatments: ProtectiveTreatment[];
  //   isLoading: boolean;
  closeFn: () => void;
  changeTj12Quantity: (value: number) => void;
  extraWork: ExtraWork | undefined;
  tj12Count: number | null;
  //   refreshAllData: () => void;
  //   changeProtectiveTreatment: (protectiveTreatment: ProtectiveTreatment) => void;
};

const Tj12CountModal = (props: Props) => {
  ////vars
  const { closeFn, changeTj12Quantity, extraWork, tj12Count } = props;

  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToTj12Quantity(
      changeTj12Quantity,
      closeFn,
      tj12Count,
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
                  name: "Ilość TJ12",
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
                {/* {todaysQuantity > 0 ? (
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
                ) : null} */}
              </View>

              <View className="w-full px-6">
                <InputFormik<ExtraWorkTj12QuantityInput>
                  label={`Podaj ilość TJ12:`}
                  placeholder="podaj ilość tj12"
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
export default Tj12CountModal;

// <View className="absolute left-0 right-0 w-full bottom-8 top-8">
//   <View className="relative flex-col items-center justify-center flex-1">
//     <View className="w-full flex-1 pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app ">
//       <View className="flex items-center justify-center w-full px-8">
//         <Text className="text-center text-foreground font-nav">
//           Wybierz stężenie
//         </Text>
//       </View>

//       <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
//         <View className="mt-2">
//           <FlatList<NitrogenConcentrationKeyValue>
//             data={nitrogenConcentrationKeyValue}
//             renderItem={({
//               item,
//             }: {
//               item: NitrogenConcentrationKeyValue;
//             }) => (
//               <View className="flex-col items-center justify-center px-6 mt-2">
//                 <View
//                   className={
//                     "flex-row items-center justify-between w-full focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app"
//                   }
//                   key={item.name}
//                 >
//                   <ButtonTextAndThreeArrows
//                     actionFn={() => {
//                       changeProtectiveTreatmentLocalHandler(item.value);
//                     }}
//                     text={`${item.name}`}
//                     isBackground
//                     color={darkColor}
//                     // disabled={disabled}
//                   />
//                 </View>
//               </View>
//             )}
//             initialNumToRender={20}
//             refreshControl={
//               <RefreshControl
//                 refreshing={isLoading}
//                 onRefresh={refreshAllData}
//               />
//             }
//             style={{ marginBottom: 12 }}
//           />
//         </View>
//       </ContainerHorizontalRoundedFrame>

//       <View className="flex-row items-center justify-between w-full pl-6 mt-6 mb-[16px]">
//         <View className="flex-1"></View>
//         <View className="ml-6">
//           <ButtonBack actionFn={closeFn} isOutline={false} />
//         </View>
//       </View>
//     </View>
//   </View>
// </View>
