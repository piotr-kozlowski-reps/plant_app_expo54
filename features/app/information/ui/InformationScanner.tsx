import { INDEX } from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForInformation } from "../domain/useScanValuesForInformation";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";

import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";

import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import DetailedInfoModal from "./DetailedInfoModal";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";

const InformationScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  //scan values
  const {
    qrLock,
    isLocalization,
    isZP,
    isTray,
    isAnyValueScanned,
    informationData,
    scannedPureValue,
    setQrLock,
    scanValueHandler,
    resetValuesToScanNextItem,
  } = useScanValuesForInformation(setIsLoading);

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-8">
            <AppPath
              paths={[INDEX, { actionFn: () => {}, name: "Informacja" }]}
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

              <Overlay />

              <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                {qrLock ? (
                  <View className="flex-col items-center justify-center w-full h-full">
                    <View className="w-full px-16">
                      <View className="opacity-70">
                        <Button
                          title="skanuj lokalizację, ZP lub tacę"
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
            </View>

            <View className="mt-8 ">
              <Text className="text-center font-nav text-destructive">
                zeskanuj kod lokalizacji,
              </Text>
              <Text className="text-center font-nav text-destructive">
                ZPka lub tacy
              </Text>
            </View>
          </View>

          <View className="flex-1"></View>

          <View className="w-full mb-6">
            <ButtonBack isOutline={false} />
          </View>
        </SafeAreaView>

        {/* choose quantities -  modal */}
        <ModalInternal
          isOpen={isAnyValueScanned}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <DetailedInfoModal
            closeFn={resetValuesToScanNextItem}
            informationData={informationData}
            isLocalization={isLocalization}
            scannedPureValue={scannedPureValue}
            isZP={isZP}
            isTray={isTray}
          />
        </ModalInternal>
      </View>
    </>
  );
};
export default InformationScanner;
