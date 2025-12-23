import {
  darkColor,
  grayColor,
  grayColorPlaceholder,
  lightColor,
  lightNuanceColor,
  primaryColor,
  yellowColor,
  yellowDarkColor,
} from "@/features/shared/constants/colorThemeVars";
import {
  FIELD_CROPS,
  INDEX,
  TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import Label from "@/features/shared/ui/label/Label";

import { router, Stack } from "expo-router";
import { Check, ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

import { Direction } from "react-native-calendars/src/types";
import { useDestroyStateState } from "../domain/useDestroyStateState";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ReportDamagedTraysModal from "./ReportDamagedTraysModal";
import { FieldCropsSubmodules } from "@/features/shared/types/interfaces-auth";
import ButtonTextAndConfirmationIcon from "@/features/shared/ui/button/ButtonTextAndConfirmationIcon";
import { useSubmoduleEntryDataAndGuard } from "@/features/shared/utils/useSubmoduleEntryDataAndGuard";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";

const FieldCropsReportDamagedTraysEntryPage = () => {
  ////vars
  const { addDaysToDate, createYearMonthDayString } = useDatesHelper();

  useSubmoduleEntryDataAndGuard<FieldCropsSubmodules>(
    "field_crops",
    "tray_operations_report_damaged_trays",
    "Raport zniszczonych tac"
  );

  LocaleConfig.locales["pl"] = {
    monthNames: [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ],
    monthNamesShort: [
      "sty.",
      "lut.",
      "mar.",
      "kwi.",
      "maj",
      "cze.",
      "lip.",
      "sie",
      "wrz.",
      "paź.",
      "lis.",
      "gru.",
    ],
    dayNames: [
      "poniedziałek",
      "wtorek",
      "środa",
      "czwartek",
      "piątek",
      "sobota",
      "niedziela",
    ],
    dayNamesShort: ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."],
    today: "dziś",
  };
  LocaleConfig.defaultLocale = "pl";

  //state
  const {
    selectedDate,
    isMine,
    isAll,
    isShowReportDamagedTraysModal,
    setIsShowReportDamagedTraysModal,
    chooseIsMine,
    setSelectedDate,
    chooseIsAll,
    getIsPossibleToGoFurther,
  } = useDestroyStateState();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full bg-yellow">
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                FIELD_CROPS,
                TRAY_OPERATIONS,
                { actionFn: () => {}, name: "Raport zniszczonych tac" },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full mt-6">
            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <View className="flex-col items-center w-full mb-[4px]">
                <View className="flex-col items-center justify-between w-full">
                  <View className="w-full">
                    <View className="mb-[6px]">
                      <Label label="Zakres:" />
                    </View>
                    <View>
                      <ButtonTextAndConfirmationIcon
                        actionFn={chooseIsMine}
                        text="Moje"
                        isCheckedValue={isMine}
                      />
                    </View>
                    <View className="mt-2">
                      <ButtonTextAndConfirmationIcon
                        actionFn={chooseIsAll}
                        text="Wszystkie"
                        isCheckedValue={isAll}
                      />
                    </View>
                  </View>

                  <View className="w-full mt-6">
                    <View>
                      <Label label="Data:" />
                    </View>
                    <View>
                      <Calendar
                        markedDates={{
                          [selectedDate]: {
                            selected: true,
                            selectedColor: darkColor,
                            disableTouchEvent: true,
                            selectedTextColor: lightNuanceColor,
                          },
                        }}
                        maxDate={createYearMonthDayString(
                          addDaysToDate(new Date(Date.now()), 0)
                        )}
                        enableSwipeMonths={true}
                        onDayPress={(day: DateData) => {
                          setSelectedDate(day.dateString);
                        }}
                        renderArrow={(direction: Direction) => {
                          if (direction === "left")
                            return (
                              <View className="p-2 bg-background-nuance rounded-app">
                                <ChevronLeft
                                  size={24}
                                  color={darkColor}
                                  strokeWidth={3}
                                  className="pr-[1px]"
                                />
                              </View>
                            );
                          else
                            return (
                              <View className="p-2 bg-background-nuance rounded-app">
                                <ChevronRight
                                  size={24}
                                  color={darkColor}
                                  strokeWidth={3}
                                  className="pl-[1px]"
                                />
                              </View>
                            );
                        }}
                        theme={{
                          backgroundColor: yellowColor,
                          calendarBackground: yellowColor,

                          //today
                          // todayBackgroundColor: lightColor,
                          todayTextColor: lightColor,

                          //disabled
                          textDisabledColor: yellowDarkColor,
                          disabledArrowColor: darkColor,
                          // textDisabledBackgroundColor: "#d9e1e8",

                          //days header
                          textSectionTitleColor: darkColor,
                          textDayHeaderFontFamily: "EuclidCircularBRegular",

                          //selected day
                          selectedDayBackgroundColor: darkColor,
                          selectedDayTextColor: lightNuanceColor,

                          // textSectionTitleDisabledColor: "#d9e1e8",
                          dayTextColor: darkColor,
                          dotColor: darkColor,
                          selectedDotColor: darkColor,
                          arrowColor: lightColor,
                          // monthTextColor: "blue",
                          // indicatorColor: "blue",
                          textDayFontFamily: "EuclidCircularBRegular",
                          textMonthFontFamily: "EuclidCircularBBold",
                          // textDayHeaderFontFamily: "euclid_regular",
                          textDayFontWeight: "500",
                          textMonthFontWeight: "bold",
                          textDayHeaderFontWeight: "300",
                          textDayFontSize: 14,
                          // textMonthFontSize: 16,
                          // textDayHeaderFontSize: 16,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={() => setIsShowReportDamagedTraysModal(true)}
                  text="zobacz"
                  isBackground
                  disabled={!getIsPossibleToGoFurther()}
                />
              </View>
              <View className="ml-6">
                <ButtonBack
                  actionFn={() => {
                    router.back();
                  }}
                  isOutline={false}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>

        <ModalInternal
          isOpen={isShowReportDamagedTraysModal}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <ReportDamagedTraysModal
            closeFn={() => setIsShowReportDamagedTraysModal(false)}
            selectedDate={selectedDate}
            isMine={isMine}
            isAll={isAll}
            // cutsList={cutsList}
            // setIsLoading={setIsLoading}
          />
        </ModalInternal>
      </View>
    </>
  );
};
export default FieldCropsReportDamagedTraysEntryPage;
