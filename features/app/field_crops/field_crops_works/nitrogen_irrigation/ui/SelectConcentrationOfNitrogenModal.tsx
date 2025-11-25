// import {
//   darkColor,
//   lightNuanceColor,
// } from "@/features/shared/constants/colorThemeVars";
// import { InHowManyDaysKeyValue } from "@/features/shared/types/interfaces-general";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
// import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
// import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
// import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import {
  darkColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { View, Text, ScrollView } from "react-native";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import { useEffect } from "react";
import { NitrogenConcentrationKeyValue } from "@/features/shared/types/interfaces-general";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

type Props = {
  protectiveTreatments: ProtectiveTreatment[];
  isLoading: boolean;
  closeFn: () => void;
  refreshAllData: () => void;
  changeProtectiveTreatment: (protectiveTreatment: ProtectiveTreatment) => void;

  // changeInHowManyDaysHandler: (inHowManyDaysInput: number) => void;
};

const SelectConcentrationOfNitrogenModal = (props: Props) => {
  ////vars
  const {
    protectiveTreatments,
    isLoading,
    closeFn,
    changeProtectiveTreatment,
    refreshAllData,
  } = props;

  const nitrogenConcentrationKeyValue: NitrogenConcentrationKeyValue[] =
    protectiveTreatments.map((protectiveTreatment) => ({
      name: protectiveTreatment.dscrpt,
      value: protectiveTreatment,
    }));
  //   const inHowManyDaysText = "Wybierz za ile dni";

  //fn
  const changeProtectiveTreatmentLocalHandler = (
    protectiveTreatment: ProtectiveTreatment
  ) => {
    changeProtectiveTreatment(protectiveTreatment);
    closeFn();
  };

  ////tsx
  return (
    <View className="absolute left-0 right-0 w-full bottom-8 top-8">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full flex-1 pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app ">
          <View className="flex items-center justify-center w-full px-8">
            <Text className="text-center text-foreground font-nav">
              Wybierz stężenie
            </Text>
          </View>

          <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
            <View className="mt-2">
              <FlatList<NitrogenConcentrationKeyValue>
                data={nitrogenConcentrationKeyValue}
                renderItem={({
                  item,
                }: {
                  item: NitrogenConcentrationKeyValue;
                }) => (
                  <View className="flex-col items-center justify-center px-6 mt-2">
                    <View
                      className={
                        "flex-row items-center justify-between w-full focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app"
                      }
                      key={item.name}
                    >
                      <ButtonTextAndThreeArrows
                        actionFn={() => {
                          changeProtectiveTreatmentLocalHandler(item.value);
                        }}
                        text={`${item.name}`}
                        isBackground
                        color={darkColor}
                        // disabled={disabled}
                      />
                    </View>
                  </View>
                )}
                initialNumToRender={20}
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={refreshAllData}
                  />
                }
                style={{ marginBottom: 12 }}
              />
            </View>
            {/* <ScrollView className="w-full">
              <View className="flex-row flex-wrap items-center justify-start flex-1 px-8 py-4">
                <View className="flex-col items-center justify-center gap-2">
                  {nitrogenConcentrationKeyValue.map((item) => {
                    return (
                      <View
                        className={
                          "flex-row items-center justify-between w-full focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app"
                        }
                        key={item.name}
                      >
                        <ButtonTextAndThreeArrows
                          actionFn={() => {
                            changeProtectiveTreatmentLocalHandler(item.value);
                          }}
                          text={`${item.name}`}
                          isBackground
                          color={darkColor}
                          // disabled={disabled}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView> */}
          </ContainerHorizontalRoundedFrame>

          <View className="flex-row items-center justify-between w-full pl-6 mt-6 mb-[16px]">
            <View className="flex-1"></View>
            <View className="ml-6">
              <ButtonBack actionFn={closeFn} isOutline={false} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default SelectConcentrationOfNitrogenModal;
