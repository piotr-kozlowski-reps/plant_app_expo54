import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import { StatusBar } from "expo-status-bar";
import { useScanValuesForDisconnectFromZpInPottedPlants } from "../domain/useScanValuesForDisconnectFromZpInPottedPlants";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import SeparatorHorizontal from "@/features/shared/ui/separator/SeparatorHorizontal";
import { useSendDisconnectFromZpData } from "@/features/app/field_crops/tray_operations/disconnect_from_zp/domain/useSendDisconnectFromZpData";

export default function PottedPlants_DisconnectFromZp_Scanner() {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  //scan values
  const { qrLock, scannedValue, setQrLock, scanValueHandler, resetValues } =
    useScanValuesForDisconnectFromZpInPottedPlants(setIsLoading, cameraRef);

  /** sending orders to hardener data */
  /**
   * @public
   * @procedureItem
   * @order 80
   * wysyłka - custom api:
   * @readFile `features/app/field_crops/tray_operations/disconnect_from_zp/domain/useSendDisconnectFromZpData.tsx`
   */
  const { sendValuesForDisconnectFromZp } = useSendDisconnectFromZpData(
    setIsLoading,
    [scannedValue!],
    resetValues,
  );

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              POTTED_PLANTS,
              POTTED_PLANTS_TRAY_OPERATIONS,
              { actionFn: () => {}, name: "Odepnij tacę" },
            ]}
          />
        </View>
        <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
          <View className="h-[37vh] w-full relative">
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
              ref={cameraRef}
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
              <>
                <Overlay />

                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title="skanuj QR kod tacy"
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
              </>
            ) : null}

            {scannedValue ? (
              <>
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                  <Text className="text-foreground font-default-bold">
                    Zeskanowano tacę.
                  </Text>
                  <Text className="text-center text-foreground font-default-normal">
                    Brak możliwości zeskanowania następnych tac.
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="flex-col items-start justify-start flex-1 w-full px-6 mt-4">
            <View className="w-full h-2"></View>
            <View className="flex-row items-center justify-center w-full gap-4">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Taca do odpięcia:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {scannedValue.stk_id}
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

            {scannedValue ? (
              <>
                <View className="flex items-center justify-center w-full mt-4">
                  <SeparatorHorizontal />
                </View>

                <View className="w-full h-[12px] mt-2"></View>
                <View className="flex-row items-center justify-center w-full gap-1">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      ZP:{" "}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-center">
                    <View>
                      <Text className="font-default-semibold text-foreground">
                        {scannedValue?.ordnmb}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-center w-full gap-1">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      Kod towaru:{" "}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-center">
                    <View>
                      <Text className="font-default-semibold text-foreground">
                        {scannedValue?.twrkod}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-center w-full gap-1">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      Nazwa towaru:{" "}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-center">
                    <View>
                      <Text className="font-default-semibold text-foreground">
                        {scannedValue?.twrnzw}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : null}
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              <ButtonTextAndThreeArrows
                actionFn={sendValuesForDisconnectFromZp}
                text="Odepnij tacę"
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
  );
}
