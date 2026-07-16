import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
// import {
//   KeyboardAwareScrollView,
//   KeyboardToolbar,
// } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForPottedPlantsPackaging } from "../domain/useScanValuesForPottedPlantsPackaging";
import Button from "@/features/shared/ui/button/Button";
// import { useConfirmChemicalTreatmentFormik } from "../domain/useConfirmChemicalTreatmentFormik";
// import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
// import {
//   ProtectiveTreatment,
//   ProtectiveTreatmentInput,
//   WhoDidProtectiveTreatment,
// } from "@/features/shared/types/interfaces-protective_treatment";
// import { Combobox } from "@/features/shared/types/interfaces-general";
// import InputFormik from "@/features/shared/ui/input/InputFormik";
// import { comboboxItems_WhoDidProtectiveTreatment } from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/ProtectiveTreatmentForm";
// import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
// import { useScanValuesForProtectiveTreatment } from "@/features/app/field_crops/field_crops_works/protective_treatment/domain/useScanValuesForProtectiveTreatment";
// import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
// import { useShowModal } from "@/features/shared/utils/useShowModal";
// import { yellowColor } from "@/features/shared/constants/colorThemeVars";
// import ProtectiveTreatmentScannerModal from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/ProtectiveTreatmentScannerModal";
// import AnotherLocalizationsToBeTreatedModal from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/AnotherLocalizationsToBeTreatedModal";
// import ModalInfoToConfirm from "@/features/shared/ui/modal/ModalInfoToConfirm";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // isLoading: boolean;
};

const PottedPlantsPackagingScanner = (props: Props) => {
  ////vars
  const { setIsLoading } = props;

  //   //scanner modal
  //   const [isShowScanner, setIsShowScanner] = useShowModal(false);

  //scanner
  const {
    scannedValue,
    //     quantity,
    //     treatment,
    //     extraWork,
    //     who,
    //     isForceToScanField,
    //     isFieldScanned,
    qrLock,
    //     isZPScanned,
    //     scannedZPOnManyFields,
    //     restOfLocalizations,
    //     isInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    //     isShowInfoConfirmationModal,
    //     infoModalDetails,

    setQrLock,
    scanValueHandler,
    //     setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    //     setDataForProtectiveTreatment,
    //     deleteScannedValue,
    //     clearScannedValues,
    //     clearZpOnManyFields,
    //     resetInfoAboutRestOfLocalizations,
    //     hideInfoConfirmationModal,
  } = useScanValuesForPottedPlantsPackaging(setIsLoading);

  ////tsx
  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <View className="w-full px-6 mt-4">
              <AppPath
                paths={[
                  INDEX,
                  POTTED_PLANTS,
                  POTTED_PLANTS_WORKS,
                  {
                    actionFn: () => {},
                    name: "Konfekcjonowanie",
                  },
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

                {!scannedValue ? (
                  <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                    {qrLock ? (
                      <View className="flex-col items-center justify-center w-full h-full">
                        <View className="w-full px-16">
                          <View className="opacity-70">
                            <Button
                              title={"skanuj ZP"}
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

                {/* {isFieldScanned ? (
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
                ) : null} */}
              </View>
            </View>

            <View className="flex-col items-center justify-between flex-1 w-full">
              <View className="w-full h-2"></View>
              <View className="flex-col items-start justify-start flex-1 w-full px-6">
                <View className="flex-col items-center w-full mb-[4px]">
                  <View className="flex-row items-center justify-between w-full">
                    {/* <View className="flex-1">
                      <ButtonTextAndIcon
                        actionFn={() => {
                          setIsShowModalWithSelectChemicalTreatmentDon(true);
                        }}
                        text={`${
                          chemicalTreatmentDon
                            ? chemicalTreatmentDon.dscrpt
                            : "środek chemiczny"
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
                          chemicalTreatmentDon ? darkColor : destructiveColor
                        }
                      />
                    </View> */}

                    {/* <View className="w-[40%] ml-4">
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
                    </View> */}
                  </View>
                </View>

                {/* <ContainerHorizontalRoundedFrame>
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
                </ContainerHorizontalRoundedFrame> */}
              </View>

              <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                <View className="flex-1">
                  <ButtonTextAndThreeArrows
                    // actionFn={() =>
                    //   sendValuesForOrderChemicalTreatmentHandler({
                    //     scannedValues,
                    //     inHowManyDays,
                    //     protectiveTreatment: chemicalTreatmentDon,
                    //   })
                    // }
                    actionFn={() => {}}
                    text="wyślij"
                    isBackground
                    disabled={true}
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

          {/* modals */}
          {/* <ModalInternal
            isOpen={isShowModalWithInHowManyDays}
            isTransparent={false}
            backgroundColor={yellowColor}
          >
            <HowManyDaysToOrderNitrogenIrrigationModal
              closeFn={() => setIsShowModalWithInHowManyDays(false)}
              changeInHowManyDaysHandler={changeInHowManyDaysHandler}
              is7Days
              // whatOrderType={whatOrderType}
            />
          </ModalInternal> */}

          {/* <ModalInternal
            isOpen={isShowDeleteModal}
            isTransparent={false}
            backgroundColor={yellowColor}
          >
            <DeleteZpForOrdersAllModal
              closeFn={() => setIsShowDeleteModal(false)}
              zpInfo={ZPSelected}
              actionFn={deleteItemFromListHandler}
            />
          </ModalInternal> */}

          {/* modal with info to confirm */}
          {/* <ModalInternal
            isOpen={isShowInfoConfirmationModal}
            isTransparent={false}
            backgroundColor={yellowColor}
          >
            <ModalInfoToConfirm
              hideInfoConfirmationModal={hideInfoConfirmationModal}
              infoModalDetails={infoModalDetails}
            />
          </ModalInternal> */}
        </View>
      </View>
    </>
  );
};

export default PottedPlantsPackagingScanner;
