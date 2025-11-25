import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { router } from "expo-router";
import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { useScanValuesForLoadingForecast } from "../domain/useScanValuesForLoadingForecast";
import Button from "@/features/shared/ui/button/Button";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { usePrepareDataForFormikToLoadingForecast } from "../domain/usePrepareDataForFormikToLoadingForecast";
import { LoadingForecastInput } from "@/features/shared/types/interfaces-loading_forecast";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import clsx from "clsx";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { AllLoadingForecastSubmodules } from "@/features/shared/types/interfaces-auth";
import { useState } from "react";
import { useGetAppPathForLoadingForecast } from "../domain/useGetAppPathForLoadingForecast";

type Props = {
  submoduleType: AllLoadingForecastSubmodules;
};

const LoadingForecastScanner = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [isLoading, setIsLoading] = useState(false);

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    usePrepareDataForFormikToLoadingForecast(setIsLoading, resetValues);

  //scan values
  const {
    qrLock,
    scannedValue,
    setQrLock,
    scanValueHandler,
    resetScannedValue,
  } = useScanValuesForLoadingForecast(setIsLoading, formik, submoduleType);

  //helpers
  function resetValues() {
    resetScannedValue();
  }

  const isValueOfTraysLowerThanAmountToPleaseClient =
    scannedValue && scannedValue.stkcnt && scannedValue.risecnt
      ? scannedValue?.stkcnt < scannedValue?.risecnt
      : false;

  //app path
  const { getAppPathForLoadingForecast } = useGetAppPathForLoadingForecast();
  const submoduleName = "Prognoza załadunku";

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <KeyboardAwareScrollView
          bottomOffset={61}
          // className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="w-full px-6 mt-4">
            {getAppPathForLoadingForecast(submoduleName, submoduleType)}
          </View>
          <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
            <View className="h-[37vh] w-full relative">
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

              <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                {qrLock ? (
                  <View className="flex-col items-center justify-center w-full h-full">
                    <View className="w-full px-16">
                      <View className="opacity-70">
                        <Button
                          title={
                            submoduleType ===
                            "field_crops_works_loading_forecast"
                              ? "skanuj ZP lub tacę"
                              : "skanuj ZP"
                          }
                          handlePress={() => {
                            setQrLock(false);
                          }}
                          // handlePress={() => scanValueHandler("ZLEC_sdefv/d345/GRU")}
                          containerStyles={`h-32`}
                          isGrayed={!qrLock}
                          // isWhite={true}
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
            </View>
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className="w-full h-2"></View>

            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <View className="flex-col items-center w-full ">
                <View className="flex-row items-center justify-center gap-4">
                  <View className="flex-row items-center justify-center">
                    <View>
                      <Text className="text-foreground font-default-normal">
                        ZP:{" "}
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
                </View>
                <View className="flex-row items-center justify-center gap-4">
                  <View className="flex-row items-center justify-center">
                    <View>
                      <Text className="text-foreground font-default-normal">
                        Nazwa:{" "}
                      </Text>
                    </View>
                    <View>
                      {scannedValue ? (
                        <Text className="font-default-semibold text-foreground">
                          {scannedValue.twrnzw}
                        </Text>
                      ) : null}
                      {!scannedValue ? (
                        <Text className="font-default-bold text-destructive">
                          -
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                {submoduleType === "field_crops_works_loading_forecast" ? (
                  <View className="flex-row items-center justify-center gap-4">
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Text className="text-foreground font-default-normal">
                          Ilość tac, by pokryć zamówienie:{" "}
                        </Text>
                      </View>
                      <View>
                        {scannedValue ? (
                          <Text
                            className={clsx(
                              "font-default-semibold ",
                              isValueOfTraysLowerThanAmountToPleaseClient
                                ? "text-destructive underline"
                                : "text-foreground"
                            )}
                          >
                            {scannedValue.risecnt}
                          </Text>
                        ) : null}
                        {!scannedValue ? (
                          <Text className="font-default-bold text-destructive">
                            -
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Text className="text-foreground font-default-normal">
                          palet:{" "}
                        </Text>
                      </View>
                      <View>
                        {scannedValue ? (
                          <Text className="font-default-semibold text-foreground">
                            {getPalletsResult(
                              scannedValue.risecnt,
                              scannedValue.wsk_palet
                            )}
                          </Text>
                        ) : null}
                        {!scannedValue ? (
                          <Text className="font-default-bold text-destructive">
                            -
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ) : null}

                {submoduleType === "greenhouse_crops_works_loading_forecast" ? (
                  <View className="flex-row items-center justify-center gap-4">
                    <View className="flex-row items-center justify-center">
                      <View>
                        <Text className="text-foreground font-default-normal">
                          Ilość kostek z zamówienia:{" "}
                        </Text>
                      </View>
                      <View>
                        {scannedValue ? (
                          <Text
                            className={clsx(
                              "font-default-semibold ",
                              isValueOfTraysLowerThanAmountToPleaseClient
                                ? "text-destructive underline"
                                : "text-foreground"
                            )}
                          >
                            {scannedValue.risecnt}
                          </Text>
                        ) : null}
                        {!scannedValue ? (
                          <Text className="font-default-bold text-destructive">
                            -
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                ) : null}

                <View className="flex-row items-center justify-center w-full mt-2">
                  <View className="w-24 h-[1px] bg-foreground"></View>
                </View>

                <View className="w-full mt-4">
                  <InputFormik<LoadingForecastInput>
                    label={
                      submoduleType === "field_crops_works_loading_forecast"
                        ? "Ilość tac do załadunku:"
                        : "Ilość kostek do załadunku:"
                    }
                    placeholder="podaj ilość"
                    isSignedAsRequired={true}
                    formik={formik}
                    formikField="traysQuantity"
                    keyboardType="numeric"
                    isVerifiedAtOnce={true}
                  />
                </View>

                <View className="flex-row items-center justify-center w-full mt-4">
                  <View className="w-24 h-[1px] bg-foreground"></View>
                </View>

                {submoduleType === "field_crops_works_loading_forecast" ? (
                  <>
                    <View className="flex-row items-center justify-center mt-2">
                      <View className="flex-row items-center justify-center">
                        <View>
                          <Text className="text-foreground font-default-normal">
                            Ilość tac wysianych:{" "}
                          </Text>
                        </View>
                        <View>
                          {scannedValue ? (
                            <Text
                              className={clsx(
                                "font-default-semibold ",
                                isValueOfTraysLowerThanAmountToPleaseClient
                                  ? "text-destructive underline"
                                  : "text-foreground"
                              )}
                            >
                              {scannedValue.stkcnt}
                            </Text>
                          ) : null}
                          {!scannedValue ? (
                            <Text className="font-default-bold text-destructive">
                              -
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-center">
                      <View className="flex-row items-center justify-center">
                        <View>
                          <Text className="text-foreground font-l-normal">
                            Palet:{" "}
                          </Text>
                        </View>
                        <View>
                          {scannedValue ? (
                            <Text className="font-nav text-foreground">
                              {getPalletsResult(
                                formik.values.traysQuantity,
                                scannedValue.wsk_palet
                              )}
                            </Text>
                          ) : null}
                          {!scannedValue ? (
                            <Text className="font-default-bold text-destructive">
                              -
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </>
                ) : null}

                {submoduleType === "greenhouse_crops_works_loading_forecast" ? (
                  <>
                    <View className="flex-row items-center justify-center mt-2">
                      <View className="flex-row items-center justify-center">
                        <View>
                          <Text className="text-foreground font-default-normal">
                            Ilość kostek dostępnych:{" "}
                          </Text>
                        </View>
                        <View>
                          {scannedValue ? (
                            <Text
                              className={clsx(
                                "font-default-semibold ",
                                isValueOfTraysLowerThanAmountToPleaseClient
                                  ? "text-destructive underline"
                                  : "text-foreground"
                              )}
                            >
                              {scannedValue.stkcnt}
                            </Text>
                          ) : null}
                          {!scannedValue ? (
                            <Text className="font-default-bold text-destructive">
                              -
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>

                    {/* <View className="flex-row items-center justify-center">
                      <View className="flex-row items-center justify-center">
                        <View>
                          <Text className="text-foreground font-l-normal">
                            Palet:{" "}
                          </Text>
                        </View>
                        <View>
                          {scannedValue ? (
                            <Text className="font-nav text-foreground">
                              {getPalletsResult(
                                formik.values.traysQuantity,
                                scannedValue.wsk_palet
                              )}
                            </Text>
                          ) : null}
                          {!scannedValue ? (
                            <Text className="font-default-bold text-destructive">
                              -
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View> */}
                  </>
                ) : null}
              </View>
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={availableFormActions}
                  text="wyślij"
                  isBackground
                  disabled={!canFormBeSubmitted || !scannedValue}
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
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} className="-mb-[16px]" />
      </SafeAreaView>
    </View>
  );
};
export default LoadingForecastScanner;

function getPalletsResult(
  forecastedTraysAmount: number | null,
  amountPerPalet: number | null
): string {
  if (forecastedTraysAmount === null || amountPerPalet === null) {
    return "0";
  }

  const pallets = Math.floor(forecastedTraysAmount / amountPerPalet);
  const traysRemaining = forecastedTraysAmount % amountPerPalet;
  return `${pallets.toString()}${
    traysRemaining ? ` + ${traysRemaining} tac` : ""
  }`;
}
