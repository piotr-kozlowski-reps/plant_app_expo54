import { View, Text, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  INDEX,
  POTTED_PLANTS,
} from "@/features/shared/types/interfaces-navigation";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import { useScannedValuesForPotting } from "../domain/useScannedValuesForPotting";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import Button from "@/features/shared/ui/button/Button";
import { clsx } from "clsx";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { PottingInput } from "@/features/shared/types/interfaces-potting";
import { usePrepareDataForFormikToPotting } from "../domain/usePrepareDataForFormikToPotting";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PottedPlantsPotting_MainWindow = (props: Props) => {
  ////vars
  const { setIsLoading } = props;
  const {
    qrLock,
    scannedValue,

    setQrLock,
    scanValueHandler,
    resetValues,
  } = useScannedValuesForPotting(setIsLoading);

  const isPossibleToScan = !scannedValue;

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToPotting(setIsLoading, scannedValue, resetValues);

  ////tsx
  return (
    <View className="relative w-full h-full">
      <SafeAreaView className="flex-1 w-full">
        <KeyboardAwareScrollView
          bottomOffset={61}
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
        >
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                POTTED_PLANTS,
                { actionFn: () => {}, name: "Doniczkowanie" },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
            <View className="h-[44vh] w-full relative">
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

              <Overlay />
              {isPossibleToScan ? (
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title={"skanuj ZP"}
                            handlePress={() => setQrLock(false)}
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
              {!isPossibleToScan ? (
                <>
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                    <Text className="text-foreground font-default-bold">
                      Zeskanowano ZP.
                    </Text>
                    <Text className="text-center text-foreground font-default-normal">
                      Brak możliwości zeskanowania następnego zlecenia
                      produkcyjnego.
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className={clsx("w-full h-2")}></View>

            <View className="flex-col items-center justify-start flex-1 w-full px-6 mt-2">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Zeskanowano:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {scannedValue.ordnmb}
                    </Text>
                  ) : null}
                  {!scannedValue ? (
                    <Text className="font-default-bold text-destructive">
                      -
                    </Text>
                  ) : null}
                </View>
              </View>

              {scannedValue ? (
                <View className="flex items-center justify-center flex-1 w-full h-full">
                  <View className="w-full">
                    <InputFormik<PottingInput>
                      label={`Podaj ilość doniczek:`}
                      placeholder="podaj ilość"
                      isSignedAsRequired={true}
                      formik={formik}
                      formikField="quantity"
                      keyboardType="numeric"
                      isVerifiedAtOnce={true}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={availableFormActions}
                  text="wyślij"
                  isBackground
                  disabled={!canFormBeSubmitted}
                />
              </View>
              <View className="ml-6">
                <ButtonBack actionFn={() => router.back()} isOutline={false} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} />
      </SafeAreaView>
    </View>
  );
};

export default PottedPlantsPotting_MainWindow;
