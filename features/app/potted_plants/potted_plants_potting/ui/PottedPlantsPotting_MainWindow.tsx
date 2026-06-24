import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
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
import { useRef } from "react";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import PictureInfoItem from "@/features/app/all_crops/order_export_to_customer/ui/PictureInfoItem";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import FullPictureModal from "@/features/app/all_crops/order_export_to_customer/ui/FullPictureModal";
import DeletePictureModal from "@/features/app/all_crops/order_export_to_customer/ui/DeletePictureModal";
import PotsQuantityModal from "./PotsQuantityModal";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PottedPlantsPotting_MainWindow = (props: Props) => {
  ////vars
  const { setIsLoading } = props;
  const cameraRef = useRef<CameraView | null>(null);

  //scan values
  const {
    qrLock,
    scannedValue,
    isShowFullPictureModal,
    chosenPicture,
    isShowDeleteModal,
    isShowQuantityModal,

    setQrLock,
    scanValueHandler,
    resetValues,
    takePhotoHandler,
    setChosenPicture,
    setIsShowDeleteModal,
    setIsShowFullPictureModal,
    deletePicture,
    setIsShowQuantityModal,
  } = useScannedValuesForPotting(setIsLoading, cameraRef);

  const isScannedValue = !!scannedValue;
  const pictures = scannedValue?.pictures || [];
  const isAnyPictureShot = !!pictures.length;
  const isMaxPicturesShot = pictures.length >= 10;

  const takePictureHandler = async () => {
    await takePhotoHandler();
  };

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
              {!isScannedValue ? (
                <>
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
                </>
              ) : null}
              {isScannedValue && !isMaxPicturesShot ? (
                <>
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title={"zrób zdjęcie"}
                            handlePress={() => takePictureHandler()}
                            containerStyles={`h-32`}
                            height={128}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              ) : null}

              {isMaxPicturesShot ? (
                <>
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                    <Text className="text-foreground font-default-bold">
                      Zeskanowano ZP i zrobiono 20 zdjęć.
                    </Text>
                    <Text className="text-center text-foreground font-default-normal">
                      Brak możliwości zeskanowania następnego zlecenia
                      produkcyjnego i zrobienia większej ilości zdjęć.
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className={clsx("w-full h-2")}></View>

            <View className="flex-col items-center justify-start flex-1 w-full px-6">
              <View className="flex-row items-center justify-center mb-1">
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
                          {MESSAGES.LACK_OF_SCANNED_ZP}
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
                  actionFn={() => setIsShowQuantityModal(true)}
                  text="podaj ilość doniczek"
                  isBackground
                  disabled={!scannedValue || !isAnyPictureShot}
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

      {/* quantity modal*/}
      <ModalInternal
        isOpen={isShowQuantityModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <PotsQuantityModal
          closeFn={() => setIsShowQuantityModal(false)}
          scannedValue={scannedValue}
          resetValues={resetValues}
          setIsLoading={setIsLoading}
        />
      </ModalInternal>
    </View>
  );
};

export default PottedPlantsPotting_MainWindow;
