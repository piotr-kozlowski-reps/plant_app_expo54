import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "../button/ButtonBack";
import { router } from "expo-router";

import { darkColor, lightColor } from "../../constants/colorThemeVars";
import clsx from "clsx";
import { usePinState } from "./domain/usePinState";
import Button from "../button/Button";

import { ChevronLeft } from "lucide-react-native";
import { ModulePin } from "../../types/interfaces-tray_operations";
import ButtonIcon from "../button/ButtonIcon";

type Props = {
  confirmPinFn: () => void;
  modulesPinsArray: ModulePin[];
};
const PinConfirmationModal = (props: Props) => {
  ////vars
  const { confirmPinFn, modulesPinsArray } = props;

  //pin state
  const { pin, pinDots, addDigitToPin, deleteLastDigit } = usePinState(
    modulesPinsArray,
    confirmPinFn
  );

  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full">
      <SafeAreaView className="flex-1 w-full">
        <View className="flex-col items-center justify-between flex-1 w-full mt-8">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            {/* <View className="w-full">
              <Text className="w-full mb-2 text-center font-default-semibold text-background-nuance">
                Wpisz kod PIN:
              </Text>
            </View> */}
            <View className="flex-col items-center justify-center flex-1 w-full">
              <View>
                <Text className="text-center font-main-menu text-background-nuance">
                  Wpisz PIN
                </Text>
              </View>
              <View className="">
                <Text className="text-center font-default-normal text-background-nuance">
                  Wpisz kod PIN, by uzyskać dostęp do modułu.
                </Text>
              </View>
              <View className="flex-row items-center justify-center h-16 gap-4 my-8">
                {pinDots.map((pin, index) => (
                  <View
                    key={index}
                    className={clsx(
                      "rounded-full bg-background-nuance",
                      pin.isSet ? "w-4 h-4 " : "w-2 h-2 "
                    )}
                  ></View>
                ))}
              </View>
              <View className="flex-col items-center justify-center gap-4 ">
                <View className="flex-row items-center justify-center gap-4">
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("1");
                      }}
                      title="1"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("2");
                      }}
                      title="2"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("3");
                      }}
                      title="3"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-center gap-4">
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("4");
                      }}
                      title="4"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("5");
                      }}
                      title="5"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("6");
                      }}
                      title="6"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-center gap-4">
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("7");
                      }}
                      title="7"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("8");
                      }}
                      title="8"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("9");
                      }}
                      title="9"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-center gap-4">
                  <View className="w-[72px] h-[72px]"></View>
                  <View className="w-[72px] h-[72px]">
                    <Button
                      handlePress={() => {
                        addDigitToPin("0");
                      }}
                      title="0"
                      bgColor={lightColor}
                      height={72}
                      isWhite
                      isBigText
                    />
                  </View>
                  <View className="w-[72px] h-[72px]">
                    <ButtonIcon
                      handlePress={deleteLastDigit}
                      icon={
                        <ChevronLeft
                          size={24}
                          color={darkColor}
                          strokeWidth={3}
                        />
                      }
                      size={72}
                      isOutline
                      marginLeft={21}
                      outlineColor={lightColor}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1"></View>
            <View className="ml-6">
              <ButtonBack actionFn={() => router.back()} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default PinConfirmationModal;
