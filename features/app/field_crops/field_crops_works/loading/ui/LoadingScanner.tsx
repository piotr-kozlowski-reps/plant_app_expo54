import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Platform, View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForLoading } from "../domain/useScanValuesForLoading";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import ZpInfoForLoading from "./ZpInfoForLoading";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ZpDeleteZpFromListModal from "./ZpDeleteZpFromListModal";
import { useSendLoadingData } from "../domain/useSendLoadingData";

const LoadingScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  //scan values
  const {
    qrLock,
    scannedValues,
    isShowDeleteModal,
    chosenZp,
    setIsShowDeleteModal,
    setQrLock,
    scanValueHandler,
    deleteZpFromList,
    showDeleteModal,
    resetWholeState,
  } = useScanValuesForLoading(setIsLoading);

  const { sendValuesForLoading } = useSendLoadingData(
    setIsLoading,
    scannedValues,
    resetWholeState
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
              FIELD_CROPS,
              FIELD_CROPS_WORKS,
              { actionFn: () => {}, name: "Załadunek" },
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

            <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
              {qrLock ? (
                <View className="flex-col items-center justify-center w-full h-full">
                  <View className="w-full px-16">
                    <View className="opacity-70">
                      <Button
                        title="skanuj ZP lub tacę"
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
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="w-full h-2"></View>
            <View className="flex-col items-center w-full">
              <Text className="text-foreground font-default-normal">
                Zlecenia załadowane:
              </Text>
            </View>

            <ContainerHorizontalRoundedFrame>
              {scannedValues.length === 0 ? (
                <View className="relative flex-1 w-full h-full">
                  <View className="absolute top-0 bottom-0 left-0 right-0 opacity-50 rounded-app">
                    <View className="flex items-center justify-center w-full h-full">
                      <Image
                        source={images.hashed_background}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: 32,
                        }}
                        contentFit="cover"
                      />
                    </View>
                  </View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 rounded-app">
                    <View className="flex items-center justify-center w-full h-full ">
                      <Text className="p-6 bg-yellow font-default-bold text-background-nuance rounded-app">
                        {MESSAGES.LACK_OF_SCANNED_ZPS}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {scannedValues.length > 0 ? (
                <ScrollView className="w-full">
                  <View className="flex-row flex-wrap items-center justify-start py-4">
                    {scannedValues.map((zp) => (
                      <ZpInfoForLoading
                        key={zp.sordid}
                        zpInfo={zp}
                        deleteAction={showDeleteModal}
                      />
                    ))}
                  </View>
                </ScrollView>
              ) : null}
            </ContainerHorizontalRoundedFrame>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              <ButtonTextAndThreeArrows
                actionFn={sendValuesForLoading}
                text="wyślij"
                isBackground
                disabled={!scannedValues.length}
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

      {/* delete Zp from list -  modal */}
      <ModalInternal
        isOpen={isShowDeleteModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ZpDeleteZpFromListModal
          closeFn={() => setIsShowDeleteModal(false)}
          zpInfo={chosenZp}
          actionFn={deleteZpFromList}
        />
      </ModalInternal>
    </View>
  );
};
export default LoadingScanner;
