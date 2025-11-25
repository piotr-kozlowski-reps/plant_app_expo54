import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import {
  FIELD_CROPS,
  INDEX,
  TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { useScanValuesForReplaceTray } from "../domain/useScanValuesForReplaceTray";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { ArrowDown } from "lucide-react-native";
import {
  darkColor,
  lightColor,
} from "@/features/shared/constants/colorThemeVars";
import clsx from "clsx";

const ReplaceTrayScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  //scan values
  const {
    qrLock,
    oldTray,
    newTray,
    setQrLock,
    scanValueHandler,
    sendValuesForReplaceTray,
  } = useScanValuesForReplaceTray(setIsLoading);

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              FIELD_CROPS,
              TRAY_OPERATIONS,
              { actionFn: () => {}, name: "Podmiana tacy" },
            ]}
          />
        </View>

        <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
          <View className="h-[50vh] w-full relative">
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
              facing="back"
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={({ data }) => {
                if (data && !qrLock) {
                  scanValueHandler(data);
                  setQrLock(true);
                }
              }}
            />

            <>
              <Overlay />

              {!newTray ? (
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title={
                              oldTray ? "skanuj nową tacę" : "skanuj starą tacę"
                            }
                            handlePress={() => {
                              setQrLock(false);
                            }}
                            containerStyles={`h-32`}
                            isGrayed={!qrLock}
                            height={128}
                          />
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {!qrLock ? (
                    <View className="flex-col items-center justify-end w-full h-full pb-6">
                      <Scanning />
                    </View>
                  ) : null}
                </View>
              ) : null}

              {newTray ? (
                <>
                  <Overlay />

                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                    <Text className="text-foreground font-default-bold">
                      Zeskanowano już obie tace.
                    </Text>
                    {/* <Text className="text-center text-foreground font-default-normal">
                      Brak możliwości zrobienia zdjęć następnych.
                    </Text> */}
                  </View>
                </>
              ) : null}
            </>
          </View>
        </View>
        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="mt-8">
            {!oldTray ? (
              <Text className="text-center font-nav text-destructive">
                zeskanuj kod starej tacy
              </Text>
            ) : null}
            {oldTray ? (
              <View className="flex-col items-center justify-center">
                <View className="flex-row items-center justify-center">
                  <Text className="text-center font-default-semibold text-foreground">
                    stara taca:{`${" "}${" "}${" "}`}
                  </Text>
                  <Text
                    className={clsx(
                      "text-center font-nav ",
                      newTray ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {oldTray.stk_id}
                  </Text>
                </View>
                <View className="my-4">
                  <ArrowDown size={24} color={darkColor} strokeWidth={4} />
                </View>
                <View className="flex-row items-center justify-center">
                  <Text className="text-center text-foreground font-default-semibold">
                    nowa taca:{`${" "}${" "}${" "}`}
                  </Text>
                  {newTray ? (
                    <Text className="text-center text-green-700 font-nav ">
                      {newTray.stk_id}
                    </Text>
                  ) : null}
                  {!newTray ? (
                    <Text className="text-center font-nav text-destructive">
                      skanuj nową tacę
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
          <View className="flex-1">
            <ButtonTextAndThreeArrows
              actionFn={() => sendValuesForReplaceTray(oldTray, newTray)}
              text="wyślij"
              isBackground
              disabled={oldTray && newTray ? false : true}
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
      </SafeAreaView>
    </View>
  );
};
export default ReplaceTrayScanner;
