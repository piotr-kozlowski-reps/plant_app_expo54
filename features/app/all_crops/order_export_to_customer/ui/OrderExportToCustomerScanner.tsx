import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useScanValuesForOrderExportToCustomer } from "../domain/useScanValuesForOrderExportToCustomer";
import {
  lightColor,
  yellowColor,
  destructiveColor,
} from "@/features/shared/constants/colorThemeVars";
import ButtonTextAndIcon from "@/features/shared/ui/button/ButtonTextAndIcon";
import { ChevronDown } from "lucide-react-native";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { router } from "expo-router";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { useSendOrderExportToCustomer } from "../domain/useSendOrderExportToCustomer";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { useHandleDayUnavailableWhenSuperDataIsOff } from "../domain/useHandleDayUnavailableWhenSuperDataIsOff";
import { useRef, useState } from "react";
import PictureInfoItem from "./PictureInfoItem";
import DeletePictureModal from "./DeletePictureModal";
import FullPictureModal from "./FullPictureModal";
import ButtonOnCameraViewForQrAndPictures from "@/features/shared/ui/button/ButtonOnCameraViewForQrAndPictures";
import CheckBoxWithText from "@/features/shared/ui/checkbox/CheckBoxWithText";
import HowManyDaysToMoveInOrdersAllModal from "../../orders_all/ui/HowManyDaysToMoveInOrdersAllModal";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { AllExportToCustomerSubmodules } from "@/features/shared/types/interfaces-auth";
import { useGetAppPathForOrderExportToCustomer } from "../domain/useGetAppPathForOrderExportToCustomer";

type Props = {
  submoduleType: AllExportToCustomerSubmodules;
};

const OrderExportToCustomerScanner = (props: Props) => {
  ////vars
  const { submoduleType } = props;
  const [isLoading, setIsLoading] = useState(false);
  const {
    renderDateInPolishWay,
    getDayNameInPolish,
    addDaysToDate,
    getIsDayAvailableToOrderExportToClient,
  } = useDatesHelper();
  const cameraRef = useRef<CameraView | null>(null);

  //app path
  const { getAppPathForOrderExportToCustomer } =
    useGetAppPathForOrderExportToCustomer();
  const submoduleName = "Zlecenie wywozu do klienta";

  const isFieldCrops =
    submoduleType === "field_crops_works_order_export_to_customer";

  //scan values
  const {
    qrLock,
    isSuperData,
    isShowModalWithInHowManyDays,
    inHowManyDays,
    scannedValue,
    isShowDeleteModal,
    chosenPicture,
    isShowFullPictureModal,
    isTakingPicturesAvailable,
    setIsShowFullPictureModal,
    setChosenPicture,
    setIsShowDeleteModal,
    setIsShowModalWithInHowManyDays,
    setIsSuperData,
    setQrLock,
    scanValueHandler,
    changeInHowManyDaysHandler,
    takePhotoHandler,
    deletePicture,
    resetValues,
  } = useScanValuesForOrderExportToCustomer(
    setIsLoading,
    cameraRef,
    submoduleType
  );

  const dateOfOrderToMoveToHardener = addDaysToDate(
    new Date(Date.now()),
    inHowManyDays ? inHowManyDays : 0
  );

  /** sending orders to hardener data */
  const { sendValuesForOrderExportToCustomerHandler, isSendingDataAvailable } =
    useSendOrderExportToCustomer(
      scannedValue,
      setIsLoading,
      resetValues,
      submoduleType
    );

  /** */
  const valueDate = addDaysToDate(new Date(Date.now()), inHowManyDays);
  const isDayAvailable = getIsDayAvailableToOrderExportToClient(valueDate);

  useHandleDayUnavailableWhenSuperDataIsOff(
    isDayAvailable,
    isSuperData,
    setIsShowModalWithInHowManyDays,
    scannedValue
  );

  /** delete item from list handler */
  const takePictureHandler = async () => {
    await takePhotoHandler();
  };

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          {getAppPathForOrderExportToCustomer(submoduleName, submoduleType)}
        </View>
        <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
          <View className="h-[37vh] w-full relative">
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
              ref={cameraRef}
              facing="back"
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={
                !scannedValue
                  ? ({ data }) => {
                      if (data && !qrLock) {
                        scanValueHandler(data);
                        setQrLock(true);
                      }
                    }
                  : undefined
              }
            />

            <ButtonOnCameraViewForQrAndPictures
              scannedValue={scannedValue}
              isTakingPicturesAvailable={isTakingPicturesAvailable}
              qrLock={qrLock}
              setQrLock={setQrLock}
              takePictureHandler={() => takePictureHandler()}
              buttonTextForQrCodeScan={
                submoduleType === "field_crops_works_order_export_to_customer"
                  ? "skanuj ZP lub tacę"
                  : "skanuj ZP"
              }
            />

            {scannedValue && !isFieldCrops ? (
              <>
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                  <Text className="text-foreground font-default-bold">
                    Zeskanowano ZP
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
              <View className="flex-row items-center justify-between w-full">
                <CheckBoxWithText
                  isActive={!!scannedValue}
                  value={isSuperData}
                  setValue={setIsSuperData}
                  text="Superdata"
                />

                {scannedValue ? (
                  <View className="flex-1 ml-8">
                    <ButtonTextAndIcon
                      actionFn={() => {
                        setIsShowModalWithInHowManyDays(true);
                      }}
                      text={`+ ${inHowManyDays} ${
                        inHowManyDays === 1 ? "dzień" : "dni"
                      }`}
                      icon={
                        <View className="ml-2">
                          <ChevronDown
                            size={24}
                            color={lightColor}
                            strokeWidth={2}
                          />
                        </View>
                      }
                      isBackground
                      isFull={false}
                      customColor={isDayAvailable ? "" : destructiveColor}
                    />
                  </View>
                ) : null}
                {!scannedValue ? (
                  <View className="flex-1 ml-8">
                    <ButtonTextAndIcon
                      actionFn={() => {
                        setIsShowModalWithInHowManyDays(true);
                      }}
                      text={`brak zeskanowanego ZPka`}
                      icon={
                        <View className="ml-2">
                          <ChevronDown
                            size={24}
                            color={lightColor}
                            strokeWidth={2}
                          />
                        </View>
                      }
                      isBackground
                      isFull={false}
                      disabled={true}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View className="flex-row items-center justify-center w-full mt-2">
              <View className="w-24 h-[1px] bg-foreground"></View>
            </View>
            <View className="flex-col items-center w-full mt-2 mb-[4px]">
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
                <View className="flex-row items-center justify-center">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      TMS:{" "}
                    </Text>
                  </View>
                  <View>
                    {scannedValue ? (
                      <Text className="font-default-semibold text-foreground">
                        {renderDateInPolishWay(scannedValue.tmsdat)}
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
                <View>
                  <Text className="text-foreground font-default-normal">
                    Nazwa: {/* px-6 ml-2 bg-background-nuance rounded-app */}
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
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Data zlecenia wywozu:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {`${renderDateInPolishWay(
                        dateOfOrderToMoveToHardener
                      )} - ${getDayNameInPolish(
                        dateOfOrderToMoveToHardener
                      )}  (+${inHowManyDays} ${
                        inHowManyDays === 1 ? "dzień" : "dni"
                      })`}
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

            {isFieldCrops ? (
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
                          {submoduleType ===
                          "field_crops_works_order_export_to_customer"
                            ? MESSAGES.LACK_OF_SCANNED_ZP_OR_TRAY
                            : MESSAGES.LACK_OF_SCANNED_ZP}
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
            ) : null}
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              <ButtonTextAndThreeArrows
                actionFn={() =>
                  sendValuesForOrderExportToCustomerHandler(
                    scannedValue!,
                    inHowManyDays,
                    isSuperData
                  )
                }
                text="wyślij"
                isBackground
                disabled={!isSendingDataAvailable}
              />
            </View>
            <View className="ml-6">
              <ButtonBack actionFn={() => router.back()} isOutline={false} />
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

      {/*  how many days modal*/}
      <ModalInternal
        isOpen={isShowModalWithInHowManyDays}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <HowManyDaysToMoveInOrdersAllModal
          closeFn={() => setIsShowModalWithInHowManyDays(false)}
          changeInHowManyDaysHandler={changeInHowManyDaysHandler}
          whatOrderType={"field_crops_works_order_export_to_customer"}
          isSuperData={isSuperData}
          isHandleUnavailableDays={true}
        />
      </ModalInternal>
    </View>
  );
};

export default OrderExportToCustomerScanner;
