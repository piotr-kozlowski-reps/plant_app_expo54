import {
  darkColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import { InHowManyDaysKeyValue } from "@/features/shared/types/interfaces-general";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { getIsPossibleToProcess_After13_guard } from "@/features/shared/utils/guards/cannotOrderAfter13_guard";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { View, Text, ScrollView } from "react-native";

type Props = {
  closeFn: () => void;
  changeInHowManyDaysHandler: (inHowManyDaysInput: number) => void;
};

const HowManyDaysToOrderNitrogenIrrigationModal = (props: Props) => {
  ////vars
  const { closeFn, changeInHowManyDaysHandler } = props;
  const {
    addDaysToDate,
    getDayNameInPolish,
    getIsDayAvailableToOrderExportToClient,
  } = useDatesHelper();

  const inHowManyDaysKeyValue: InHowManyDaysKeyValue[] = [
    { name: "+ 1 dzień", value: 1 },
    { name: "+ 2 dni", value: 2 },
    { name: "+ 3 dni", value: 3 },
    { name: "+ 4 dni", value: 4 },
    { name: "+ 5 dni", value: 5 },
  ];
  const inHowManyDaysText = "Wybierz za ile dni";

  //fn
  const changeInHowManyDaysLocalHandler = (inHowManyDaysInput: number) => {
    changeInHowManyDaysHandler(inHowManyDaysInput);

    const isPossibleToProcess_Before13 = getIsPossibleToProcess_After13_guard();
    if (inHowManyDaysInput < 2 && !isPossibleToProcess_Before13) {
      return;
    }
    closeFn();
  };

  ////tsx
  return (
    <View className="absolute left-0 right-0 w-full bottom-8 top-8">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full flex-1 pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app ">
          <View className="flex items-center justify-center w-full px-8">
            <Text className="text-center text-foreground font-nav">
              {inHowManyDaysText}
            </Text>
          </View>

          <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
            <ScrollView className="w-full">
              <View className="flex-row flex-wrap items-center justify-start flex-1 px-8 py-4">
                <View className="flex-col items-center justify-center gap-2">
                  {inHowManyDaysKeyValue.map((item) => {
                    const valueDate = addDaysToDate(
                      new Date(Date.now()),
                      item.value
                    );

                    return (
                      <View
                        className={
                          "flex-row items-center justify-between w-full focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app"
                        }
                        key={item.value}
                      >
                        <ButtonTextAndThreeArrows
                          actionFn={() => {
                            changeInHowManyDaysLocalHandler(item.value);
                          }}
                          text={`${item.name} ${" "}${" "}(${addDaysToDate(
                            new Date(Date.now()),
                            item.value
                          ).toLocaleDateString("pl-PL")} - ${getDayNameInPolish(
                            addDaysToDate(new Date(Date.now()), item.value)
                          )} )`}
                          isBackground
                          color={darkColor}
                          // disabled={disabled}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
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
export default HowManyDaysToOrderNitrogenIrrigationModal;
