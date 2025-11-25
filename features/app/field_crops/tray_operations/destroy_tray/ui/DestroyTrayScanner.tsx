import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import {
  FIELD_CROPS,
  INDEX,
  TRAY_OPERATIONS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForDestroyTray } from "../domain/useScanValuesForDestroyTray";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import ButtonOnCameraViewForQrAndPictures from "@/features/shared/ui/button/ButtonOnCameraViewForQrAndPictures";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import { useSendDestroyTray } from "../domain/useSendDestroyTray";
import PictureInfoItem from "@/features/app/all_crops/order_export_to_customer/ui/PictureInfoItem";
import FullPictureModal from "@/features/app/all_crops/order_export_to_customer/ui/FullPictureModal";
import DeletePictureModal from "@/features/app/all_crops/order_export_to_customer/ui/DeletePictureModal";

const DestroyTrayScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  //scan values
  const {
    qrLock,
    scannedValue,
    isTakingPicturesAvailable,
    chosenPicture,
    isShowDeleteModal,
    isShowFullPictureModal,
    setIsShowFullPictureModal,
    setIsShowDeleteModal,
    setChosenPicture,
    setQrLock,
    scanValueHandler,
    takePhotoHandler,
    deletePicture,
    resetValues,
  } = useScanValuesForDestroyTray(setIsLoading, cameraRef);

  //fn
  const takePictureHandler = async () => {
    await takePhotoHandler();
  };

  /** sending orders to hardener data */
  const { sendValuesForDestroyTrayHandler, isSendingDataAvailable } =
    useSendDestroyTray(scannedValue, setIsLoading, resetValues);

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
              { actionFn: () => {}, name: "Niszczenie tacy" },
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

            <ButtonOnCameraViewForQrAndPictures
              scannedValue={scannedValue}
              isTakingPicturesAvailable={isTakingPicturesAvailable}
              qrLock={qrLock}
              setQrLock={setQrLock}
              takePictureHandler={() => takePictureHandler()}
              buttonTextForQrCodeScan={"skanuj QR kod tacy"}
            />
          </View>
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="w-full h-2"></View>
            <View className="flex-row items-center justify-center w-full gap-4">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Taca do zniszczenia:{" "}
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
              {/* <View className="flex-row items-center justify-center">
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
              </View> */}
            </View>

            <View className="w-full h-[12px]"></View>
            <View className="flex-row items-center justify-center w-full gap-4">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Zdjęcia uszkodzeń tacy:{" "}
                  </Text>
                </View>
              </View>
            </View>

            <ContainerHorizontalRoundedFrame>
              {!scannedValue ? (
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
                        {MESSAGES.LACK_OF_SCANNED_TRAY}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {scannedValue && !scannedValue.pictures.length ? (
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
                        {MESSAGES.LACK_OF_TAKEN_PHOTOS}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              {scannedValue && scannedValue.pictures.length > 0 ? (
                <ScrollView className="w-full">
                  <View className="flex-row flex-wrap items-center justify-start py-4">
                    {scannedValue.pictures.map((pic, index) => (
                      <PictureInfoItem
                        key={index}
                        picture={pic}
                        index={index}
                        setChosenPicture={setChosenPicture}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowFullPictureModal={setIsShowFullPictureModal}
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
                actionFn={sendValuesForDestroyTrayHandler}
                text="wyślij"
                isBackground
                disabled={!isSendingDataAvailable}
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

      {/* see full picture -  modal */}
      <ModalInternal
        isOpen={isShowFullPictureModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <FullPictureModal
          closeFn={() => setIsShowFullPictureModal(false)}
          picture={chosenPicture}
          deletePicture={deletePicture}
        />
      </ModalInternal>

      {/* delete picture modal*/}
      <ModalInternal
        isOpen={isShowDeleteModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <DeletePictureModal
          closeFn={() => setIsShowDeleteModal(false)}
          picture={chosenPicture}
          deletePicture={deletePicture}
        />
      </ModalInternal>
    </View>
  );
};
export default DestroyTrayScanner;
