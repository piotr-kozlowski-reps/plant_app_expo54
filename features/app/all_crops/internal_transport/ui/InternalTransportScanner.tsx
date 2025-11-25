import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import { View, Text, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import { useScanValuesForInternalTransport } from "../domain/useScanValuesForInternalTransport";

import Scanning from "@/features/shared/ui/scanning/Scanning";
import Button from "@/features/shared/ui/button/Button";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import clsx from "clsx";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ZpConfirmQuantitiesInternalTransportModal from "./ZpConfirmQuantitiesInternalTransportModal";
import ZPItemInternalTransportOverallInfo from "./ZPItemInternalTransportOverallInfo";
import { ZPCombinedInfo } from "@/features/shared/types/interfaces-zp";
import { AllInternalTransportSubmodules } from "@/features/shared/types/interfaces-auth";

import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import { useGetAppPathForInternalTransportAll } from "@/features/shared/utils/useGetAppPathForInternalTransportAll";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";

type Props = {
  submoduleType: AllInternalTransportSubmodules;
};

const InternalTransportScanner = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [isLoading, setIsLoading] = useState(false);

  //app path
  const { getAppPathForInternalTransportAll } =
    useGetAppPathForInternalTransportAll();
  const submoduleName = "Transport wewnętrzny";

  //scan values
  const {
    isShowModalWithZPDetails,
    localization,
    ZPsWithQuantities,
    qrLock,
    isFieldScanned,
    zpCombinedInfo,
    setQrLock,
    scanValueHandler,
    setIIsShowModalWithZPDetails,
    changeQuantityHandler,
    changeOverallZPsWithQuantities,
    clearChosenZPCombinedInfo,
    sendValuesForInternalTransport,
    setZpCombinedInfo,
  } = useScanValuesForInternalTransport(setIsLoading, submoduleType);

  const showModalWithDetailsHandler = (zpInfo: ZPCombinedInfo) => {
    setZpCombinedInfo(zpInfo);
    setIIsShowModalWithZPDetails(true);
  };

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          {getAppPathForInternalTransportAll(submoduleName, submoduleType)}
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
                          isFieldScanned
                            ? "skanuj ZP"
                            : "skanuj kod lokalizacji"
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
          {/* <View className="h-4"></View> */}
          <View className="w-full h-2"></View>

          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="flex-col items-center w-full mb-[4px]">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Lokalizacja docelowa:{" "}
                    {/* px-6 ml-2 bg-background-nuance rounded-app */}
                  </Text>
                </View>
                <View
                  className={clsx(
                    localization
                      ? "px-6 ml-2 bg-background-nuance rounded-app"
                      : ""
                  )}
                >
                  {localization ? (
                    <Text className="font-nav text-foreground">
                      {localization.planam}
                    </Text>
                  ) : null}
                  {!localization ? (
                    <Text className="font-default-bold text-destructive">
                      zeskanuj kod lokalizacji
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <ContainerHorizontalRoundedFrame>
              {/* no ZP scanned */}
              {ZPsWithQuantities.length === 0 ? (
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

              {/* ZP scanned */}
              {ZPsWithQuantities.length > 0 ? (
                <ScrollView className="w-full">
                  <View className="flex-row flex-wrap items-center justify-start py-4">
                    {ZPsWithQuantities.map((zpInfo) => (
                      <ZPItemInternalTransportOverallInfo
                        key={zpInfo.ordnmb}
                        zpInfo={zpInfo}
                        actionFn={() => {
                          showModalWithDetailsHandler(zpInfo);
                        }}
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
                actionFn={sendValuesForInternalTransport}
                text="wyślij"
                isBackground
                disabled={ZPsWithQuantities.length === 0}
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

      {/* choose quantities -  modal */}
      <ModalInternal
        isOpen={isShowModalWithZPDetails}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ZpConfirmQuantitiesInternalTransportModal
          closeFn={() => setIIsShowModalWithZPDetails(false)}
          zpCombinedInfo={zpCombinedInfo}
          localization={localization}
          changeQuantityHandler={changeQuantityHandler}
          changeOverallZPsWithQuantities={changeOverallZPsWithQuantities}
          clearChosenZPCombinedInfo={clearChosenZPCombinedInfo}
          submoduleType={submoduleType}
        />
      </ModalInternal>
    </View>
  );
};
export default InternalTransportScanner;
