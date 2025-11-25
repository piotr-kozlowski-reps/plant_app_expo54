import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
  NITROGEN_IRRIGATION,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "../../../extra_works_zp/ui/Overlay";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { useScanValuesForOrderNitrogenIrrigation } from "../domain/useScanValuesForOrderNitrogenIrrigation";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import images from "@/features/shared/constants/images";
import { Image } from "expo-image";
import { MESSAGES } from "@/features/shared/utils/messages";
import ButtonTextAndIcon from "@/features/shared/ui/button/ButtonTextAndIcon";
import { ChevronDown } from "lucide-react-native";
import {
  darkColor,
  destructiveColor,
  lightColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import HowManyDaysToOrderNitrogenIrrigationModal from "./HowManyDaysToOrderNitrogenIrrigationModal";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import ZPItemInOrdersAllInfo from "../../../../all_crops/orders_all/ui/ZPItemInOrdersAllInfo";
import DeleteZpForOrdersAllModal from "../../../../all_crops/orders_all/ui/DeleteZpForOrdersAllModal";
import { useSendOrderNitrogenIrrigation } from "../domain/useSendOrderNitrogenIrrigation";
import { useEffect } from "react";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import ModalInfoToConfirm from "@/features/shared/ui/modal/ModalInfoToConfirm";

type Props = {
  closeFn: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  protectiveTreatment: ProtectiveTreatment | null;
  setIsShowModalWithSelectConcentration: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  resetValuesForProtectiveTreatments: () => void;
  nitrogenIrrigationList: ZpToNitrogenIrrigation[];
};

const OrderToNitrogenIrrigationModal = (props: Props) => {
  ////vars
  const {
    protectiveTreatment,
    nitrogenIrrigationList,

    setIsLoading,
    closeFn,
    setIsShowModalWithSelectConcentration,
    resetValuesForProtectiveTreatments,
  } = props;

  //scan values
  const {
    qrLock,
    isFieldScanned,
    scannedValues,
    isShowModalWithInHowManyDays,
    inHowManyDays,
    isShowDeleteModal,
    ZPSelected,
    infoModalDetails,
    isShowInfoConfirmationModal,

    setZPSelected,
    setIsShowDeleteModal,
    setIsShowModalWithInHowManyDays,
    setQrLock,
    scanValueHandler,
    changeInHowManyDaysHandler,
    deleteValueFromList,
    resetValues,
    hideInfoConfirmationModal,
    // resetScannedValue,
  } = useScanValuesForOrderNitrogenIrrigation(
    setIsLoading,
    resetValuesForProtectiveTreatments,
    nitrogenIrrigationList
  );

  /** delete item from list handler */
  const deleteItemFromListHandler = () => {
    deleteValueFromList(ZPSelected);
  };

  /** send nitrogen irrigation orders  */
  const sendValuesForOrderNitrogenIrrigationHandler =
    useSendOrderNitrogenIrrigation(setIsLoading, resetValues);

  /** set treatment to null when opened component*/
  useEffect(() => {
    resetValuesForProtectiveTreatments();
  }, []);

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative w-full h-full">
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                FIELD_CROPS,
                FIELD_CROPS_WORKS,
                NITROGEN_IRRIGATION,
                { actionFn: () => {}, name: "Zlecenie podlewania azotem" },
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

              {!isFieldScanned ? (
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title={"skanuj lokalizację lub ZP"}
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

              {isFieldScanned ? (
                <>
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                  <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                    <Text className="text-foreground font-default-bold">
                      Zeskanowano całą lokalizację.
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
                  <View className="flex-1">
                    <ButtonTextAndIcon
                      actionFn={() => {
                        setIsShowModalWithSelectConcentration(true);
                      }}
                      text={`${
                        protectiveTreatment
                          ? protectiveTreatment.dscrpt
                          : "wybierz stężenie"
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
                      customColor={
                        protectiveTreatment ? darkColor : destructiveColor
                      }
                      // customTextColor={destructiveColor}
                    />
                  </View>

                  <View className="ml-4">
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
                    />
                  </View>
                </View>
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
                      {scannedValues.map((zpInfo) => (
                        <ZPItemInOrdersAllInfo
                          key={zpInfo.ordnmb}
                          zpInfo={zpInfo}
                          inHowManyDays={inHowManyDays}
                          setIsShowDeleteModal={setIsShowDeleteModal}
                          setZPSelected={setZPSelected}
                          isPossibleToDeleteItem={!isFieldScanned}
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
                  actionFn={() =>
                    sendValuesForOrderNitrogenIrrigationHandler({
                      scannedValues,
                      inHowManyDays,
                      protectiveTreatment,
                    })
                  }
                  text="wyślij"
                  isBackground
                  disabled={scannedValues.length === 0 || !protectiveTreatment}
                />
              </View>
              <View className="ml-6">
                <ButtonBack
                  actionFn={() => {
                    closeFn();
                  }}
                  isOutline={false}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* modals */}
        <ModalInternal
          isOpen={isShowModalWithInHowManyDays}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <HowManyDaysToOrderNitrogenIrrigationModal
            closeFn={() => setIsShowModalWithInHowManyDays(false)}
            changeInHowManyDaysHandler={changeInHowManyDaysHandler}
            // whatOrderType={whatOrderType}
          />
        </ModalInternal>

        <ModalInternal
          isOpen={isShowDeleteModal}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <DeleteZpForOrdersAllModal
            closeFn={() => setIsShowDeleteModal(false)}
            zpInfo={ZPSelected}
            actionFn={deleteItemFromListHandler}
          />
        </ModalInternal>

        {/* modal with info to confirm */}
        <ModalInternal
          isOpen={isShowInfoConfirmationModal}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <ModalInfoToConfirm
            hideInfoConfirmationModal={hideInfoConfirmationModal}
            infoModalDetails={infoModalDetails}
          />
        </ModalInternal>
      </View>
    </View>
  );
};

export default OrderToNitrogenIrrigationModal;
