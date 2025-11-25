import {
  darkColor,
  destructiveColor,
  lightColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { InHowManyDaysKeyValue } from "@/features/shared/types/interfaces-general";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndIcon from "@/features/shared/ui/button/ButtonTextAndIcon";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { View, Text, ScrollView } from "react-native";
import { useGetOrderDetailsDependingOnType } from "../domain/useGetOrderDetailsDependingOnType";

type Props = {
  closeFn: () => void;
  changeInHowManyDaysHandler: (inHowManyDaysInput: number) => void;
  whatOrderType: AllCropsOrdersSubmodules;
  isHandleUnavailableDays?: boolean;
  isSuperData?: boolean;
};

const HowManyDaysToMoveInOrdersAllModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    changeInHowManyDaysHandler,
    whatOrderType,
    isSuperData = false,
    isHandleUnavailableDays = false,
  } = props;
  const {
    addDaysToDate,
    getDayNameInPolish,
    getIsDayAvailableToOrderExportToClient,
  } = useDatesHelper();
  const { inHowManyDaysPlaceOrder_Array, inHowManyDaysText } =
    useGetOrderDetailsDependingOnType(whatOrderType);

  //fn
  const changeInHowManyDaysLocalHandler = (inHowManyDaysInput: number) => {
    changeInHowManyDaysHandler(inHowManyDaysInput);
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
                  {inHowManyDaysPlaceOrder_Array.map((item) => {
                    const valueDate = addDaysToDate(
                      new Date(Date.now()),
                      item.value
                    );
                    const isDayAvailable =
                      getIsDayAvailableToOrderExportToClient(valueDate);
                    const color = isHandleUnavailableDays
                      ? isDayAvailable
                        ? darkColor
                        : destructiveColor
                      : darkColor;

                    let disabled = false;
                    if (
                      isHandleUnavailableDays &&
                      !isDayAvailable &&
                      !isSuperData
                    )
                      disabled = true;
                    if (
                      isHandleUnavailableDays &&
                      !isDayAvailable &&
                      isSuperData
                    )
                      disabled = false;

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
                          color={color}
                          disabled={disabled}
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
export default HowManyDaysToMoveInOrdersAllModal;
