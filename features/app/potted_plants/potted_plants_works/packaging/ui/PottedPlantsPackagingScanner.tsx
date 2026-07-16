import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForPottedPlantsPackaging } from "../domain/useScanValuesForPottedPlantsPackaging";
import Button from "@/features/shared/ui/button/Button";
import { useSendPottedPlantsPackaging } from "../domain/useSendPottedPlantsPackaging";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // isLoading: boolean;
};

const PottedPlantsPackagingScanner = (props: Props) => {
  ////vars
  const { setIsLoading } = props;

  //scanner
  const {
    scannedValue,
    qrLock,

    setQrLock,
    scanValueHandler,
    resetValues,
  } = useScanValuesForPottedPlantsPackaging(setIsLoading);

  /** send chemical treatment orders  */
  const sendPottedPlantsPackagingHandler = useSendPottedPlantsPackaging(
    setIsLoading,
    resetValues,
  );

  ////tsx
  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <View className="w-full px-6 mt-4">
              <AppPath
                paths={[
                  INDEX,
                  POTTED_PLANTS,
                  POTTED_PLANTS_WORKS,
                  {
                    actionFn: () => {},
                    name: "Konfekcjonowanie",
                  },
                ]}
              />
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

                {!scannedValue ? (
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                    {qrLock ? (
                      <View className="flex-col items-center justify-center w-full h-full">
                        <View className="w-full px-16">
                          <View className="opacity-70">
                            <Button
                              title={"skanuj ZP"}
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

                {scannedValue ? (
                  <>
                    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                    <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                      <Text className="text-foreground font-default-bold">
                        Zeskanowano ZP.
                      </Text>
                      <Text className="text-center text-foreground font-default-normal">
                        Brak możliwości zeskanowania następnych elementów.
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            </View>

            <View className="flex-col items-center justify-between flex-1 w-full">
              <View className="w-full h-2"></View>
              <View className="flex-col items-start justify-start flex-1 w-full px-6">
                <View className="flex-col items-center w-full mb-[4px]">
                  <View className="w-full ">
                    <View className="flex items-center justify-center w-full mt-8">
                      <Text className="font-default-normal">
                        Zeskanowano zlecenie:
                      </Text>
                    </View>
                    <View className="flex items-center justify-center w-full">
                      <Text className="font-title">{scannedValue?.ordnmb}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                <View className="flex-1">
                  <ButtonTextAndThreeArrows
                    actionFn={() =>
                      sendPottedPlantsPackagingHandler(scannedValue)
                    }
                    text="potwierdź"
                    isBackground
                    disabled={!scannedValue}
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
        </View>
      </View>
    </>
  );
};

export default PottedPlantsPackagingScanner;
