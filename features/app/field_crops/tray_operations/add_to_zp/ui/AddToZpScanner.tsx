import {
  INDEX,
  TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Platform, StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { useScanValuesForAddToZP } from "../domain/useScanValuesForAddToZP";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import { useSendAddToZpData } from "../domain/useSendAddToZpData";
import TrayInfoForMovingToGarden from "../../move_to_garden/ui/TrayInfoForMovingToGarden";
import TrayInfoForAddToZp from "./TrayInfoForAddToZp";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import DeleteTrayFromListModal from "../../move_to_garden/ui/DeleteTrayFromListModal";

const AddToZpScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  //scan values
  const {
    qrLock,
    zp,
    scannedTrays,
    isShowDeleteModal,
    chosenTray,

    setIsShowDeleteModal,
    setZp,
    scanValueHandler,
    setQrLock,
    showDeleteModal,
    deleteTrayFromList,
    resetWholeState,
  } = useScanValuesForAddToZP(setIsLoading);

  const { sendValuesForAddToZp } = useSendAddToZpData(
    setIsLoading,
    resetWholeState
  );

  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              TRAY_OPERATIONS,
              { actionFn: () => {}, name: "Przypnij do ZP" },
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
                        title={!zp ? "skanuj ZP" : "skanuj tace"}
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

        <View className="w-full h-4"></View>
        <View className="px-6 mb-[4px]">
          <View className="flex-row items-center justify-center">
            <View>
              <Text className="text-foreground font-default-normal">
                Wybrany ZP:{" "}
              </Text>
            </View>
            <View>
              {zp ? (
                <Text className="font-nav text-foreground">{zp.ordnmb}</Text>
              ) : null}
              {!zp ? (
                <Text className="font-default-bold text-destructive">-</Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row items-center justify-center">
            <View>
              <Text className="text-foreground font-default-normal">Kod: </Text>
            </View>
            <View>
              {zp ? (
                <Text className="font-default-bold text-foreground">
                  {zp.twrkod}
                </Text>
              ) : null}
              {!zp ? (
                <Text className="font-default-bold text-destructive">-</Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row items-center justify-center w-full mt-4">
            <View className="w-24 h-[1px] bg-foreground"></View>
          </View>
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="w-full h-2"></View>
            <View className="flex-col items-center w-full">
              <Text className="text-foreground font-default-normal">
                Tace do przypięcia do ZPka:
              </Text>
            </View>

            <ContainerHorizontalRoundedFrame>
              {scannedTrays.length === 0 ? (
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
                        {MESSAGES.LACK_OF_SCANNED_TRAYS}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {scannedTrays.length > 0 ? (
                <ScrollView className="w-full">
                  <View className="flex-row flex-wrap items-center justify-start py-4">
                    {scannedTrays.map((tray, index) => (
                      <TrayInfoForAddToZp
                        index={index}
                        key={tray.stk_id}
                        tray={tray}
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
                actionFn={() => sendValuesForAddToZp(zp, scannedTrays)}
                text="wyślij"
                isBackground
                disabled={!scannedTrays.length || !zp}
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
        <DeleteTrayFromListModal
          closeFn={() => setIsShowDeleteModal(false)}
          tray={chosenTray}
          actionFn={deleteTrayFromList}
        />
      </ModalInternal>
    </View>
  );
};

export default AddToZpScanner;
