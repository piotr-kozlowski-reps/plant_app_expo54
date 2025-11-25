import { View, Text, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForOrderToHardener } from "../domain/useScanValuesForOrderToHardener";

import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import {
  lightColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import TargetLocalizationModal from "./TargetLocalizationModal";
import { useSendOrderToHardener } from "../domain/useSendOrderToHardener";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import ZPItemInOrdersAllInfo from "./ZPItemInOrdersAllInfo";
import { Localization } from "@/features/shared/types/interfaces-localization";
import DeleteZpForOrdersAllModal from "./DeleteZpForOrdersAllModal";
import { ChevronDown } from "lucide-react-native";
import HowManyDaysToMoveInOrdersAllModal from "./HowManyDaysToMoveInOrdersAllModal";
import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { useGetOrderDetailsDependingOnType } from "../domain/useGetOrderDetailsDependingOnType";
import { useGetAppPathForOrdersAll } from "@/features/shared/utils/useGetAppPathForOrdersAll";
import ButtonTextAndIcon from "../../../../shared/ui/button/ButtonTextAndIcon";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  localizations: Localization[];
  refreshAllData: () => void;
  whatOrderType: AllCropsOrdersSubmodules;
  isLoading: boolean;
};

const OrdersAllScanner = (props: Props) => {
  ////vars
  const {
    setIsLoading,
    localizations,
    refreshAllData,
    whatOrderType,
    isLoading,
  } = props;
  const { submoduleName } = useGetOrderDetailsDependingOnType(whatOrderType);
  const { getAppPathForOrdersAll } = useGetAppPathForOrdersAll();

  //scan values
  const {
    scannedValues,
    qrLock,
    targetLocalization,
    isFieldScanned,
    inHowManyDays,
    isShowModalTargetLocalization,
    isShowDeleteModal,
    ZPSelected,
    isShowModalWithInHowManyDays,
    isRememberMe,
    setIsRememberMe,
    setIsShowModalWithInHowManyDays,
    setZPSelected,
    setIsShowDeleteModal,
    setQrLock,
    scanValueHandler,
    setIsShowModalTargetLocalization,
    setTargetLocalizationHandler,
    deleteValueFromList,
    clearScannedValues,
    changeInHowManyDaysHandler,
  } = useScanValuesForOrderToHardener(setIsLoading, whatOrderType);

  /** sending orders to hardener data */
  const sendValuesForOrderToHardenerHandler = useSendOrderToHardener(
    setIsLoading,
    clearScannedValues,
    () => setIsShowModalTargetLocalization(true),
    whatOrderType
  );

  /** delete item from list handler */
  const deleteItemFromListHandler = () => {
    deleteValueFromList(ZPSelected);
  };

  ////tsx
  return (
    <View className="relative w-full h-full">
      {!isShowModalTargetLocalization ? (
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            {getAppPathForOrdersAll(submoduleName, whatOrderType)}
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
                            title={"skanuj lokalizację, ZP lub tacę"}
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
                  <View className="flex-row items-center justify-start">
                    <View>
                      <Text className="text-foreground font-default-normal">
                        Lokalizacja docelowa:{" "}
                      </Text>
                    </View>
                    <View className="px-6 ml-2 bg-background-nuance rounded-app">
                      <Text className="font-nav text-foreground">
                        {targetLocalization?.planam}
                      </Text>
                    </View>
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
                    sendValuesForOrderToHardenerHandler({
                      scannedValues,
                      inHowManyDays,
                      targetLocalization,
                    })
                  }
                  text="wyślij"
                  isBackground
                  disabled={scannedValues.length === 0}
                />
              </View>
              <View className="ml-6">
                <ButtonBack
                  actionFn={() => {
                    setIsShowModalTargetLocalization(true);
                  }}
                  isOutline={false}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : null}

      {/* target localization -  modal */}
      <ModalInternal
        isOpen={isShowModalTargetLocalization}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <TargetLocalizationModal
          closeFn={() => setIsShowModalTargetLocalization(false)}
          localizations={localizations}
          setTargetLocalizationHandler={setTargetLocalizationHandler}
          refreshAllData={refreshAllData}
          whatOrderType={whatOrderType}
          isLoading={isLoading}
        />
      </ModalInternal>

      {/* delete zp modal */}
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

      <ModalInternal
        isOpen={isShowModalWithInHowManyDays}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <HowManyDaysToMoveInOrdersAllModal
          closeFn={() => setIsShowModalWithInHowManyDays(false)}
          changeInHowManyDaysHandler={changeInHowManyDaysHandler}
          whatOrderType={whatOrderType}
        />
      </ModalInternal>
    </View>
  );
};

export default OrdersAllScanner;
