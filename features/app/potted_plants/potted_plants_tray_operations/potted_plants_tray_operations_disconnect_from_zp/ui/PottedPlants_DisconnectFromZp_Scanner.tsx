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

export default function PottedPlants_DisconnectFromZp_Scanner() {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  //scan values
  const {
    qrLock,
    scannedValue,
    // isTakingPicturesAvailable,
    // chosenPicture,
    // isShowDeleteModal,
    // isShowFullPictureModal,
    // setIsShowFullPictureModal,
    // setIsShowDeleteModal,
    // setChosenPicture,
    setQrLock,
    scanValueHandler,
    // takePhotoHandler,
    // deletePicture,
    // resetValues,
  } = useScanValuesForDisconnectFromZpInPottedPlants(setIsLoading, cameraRef);

  console.log({ scannedValue });

  // /** sending orders to hardener data */
  // const { sendValuesForDestroyTrayHandler, isSendingDataAvailable } =
  //   useSendDestroyTray(scannedValue, setIsLoading, resetValues);

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

            {/* <ButtonOnCameraViewForQrAndPictures
              scannedValue={scannedValue}
              isTakingPicturesAvailable={isTakingPicturesAvailable}
              qrLock={qrLock}
              setQrLock={setQrLock}
              takePictureHandler={() => takePictureHandler()}
              buttonTextForQrCodeScan={"skanuj QR kod tacy"}
            /> */}
          </View>
        </View>

        {/* <View className="flex-col items-center justify-between flex-1 w-full">
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
        </View> */}
      </SafeAreaView>

      {/* see full picture -  modal */}
      {/* <ModalInternal
        isOpen={isShowFullPictureModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <FullPictureModal
          closeFn={() => setIsShowFullPictureModal(false)}
          picture={chosenPicture}
          deletePicture={deletePicture}
        />
      </ModalInternal> */}

      {/* delete picture modal*/}
      {/* <ModalInternal
        isOpen={isShowDeleteModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <DeletePictureModal
          closeFn={() => setIsShowDeleteModal(false)}
          picture={chosenPicture}
          deletePicture={deletePicture}
        />
      </ModalInternal> */}
    </View>
  );
}
