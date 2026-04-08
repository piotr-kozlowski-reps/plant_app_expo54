import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import Button from "@/features/shared/ui/button/Button";
import { Overlay } from "./Overlay";
import { useScannedValues } from "../domain/useScannedValues";
import {
  ExtraWork,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { useSendExtraWorkData } from "../domain/useSendExtraWorkData";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { MESSAGES } from "@/features/shared/utils/messages";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import DeleteZpModal from "./DeleteZpModal";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import {
  darkColor,
  destructiveColor,
  lightColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import ZpItem from "./ZpItem";
import ChangePercentageZpModal from "./ChangePercentageZpModal";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { ProtectiveTreatment } from "@/features/shared/types/interfaces-protective_treatment";
import ButtonTextAndIcon from "@/features/shared/ui/button/ButtonTextAndIcon";
import { useSelectConcentration } from "../domain/useSelectConcentration";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import SelectConcentrationOfNitrogenModal from "../../field_crops_works/nitrogen_irrigation/ui/SelectConcentrationOfNitrogenModal";
import clsx from "clsx";
import { ZpToNitrogenIrrigation } from "@/features/shared/types/interfaces-nitrogen_irrigation";
import { useInputTjQuantity } from "../domain/useInputTjQuantity";
import TjQuantityModal from "../../field_crops_works/nitrogen_irrigation/ui/TjQuantityModal";
import {
  getIsHobbyExtraWorkWithTj10,
  getIsHobbyExtraWorkWithTj12,
} from "@/features/shared/utils/hobbyExtraWorksHelpers";

type TProps = {
  closeFn: () => void;
  extraWork: ExtraWork | undefined;
  nitrogenProtectiveTreatments: ProtectiveTreatment[];
  refreshAllData: () => void;
  zpListWithOrderedNitrogenIrrigation: ZpToNitrogenIrrigation[];
  appPath: React.ReactNode;
  isRoz?: boolean;
  isHobbyTech?: boolean;
};

const BarcodeScanner = (props: TProps) => {
  ////vars
  const {
    extraWork,
    nitrogenProtectiveTreatments,
    zpListWithOrderedNitrogenIrrigation,
    appPath,
    isRoz = false,
    isHobbyTech = false,

    refreshAllData,
    closeFn,
  } = props;

  if (!extraWork) {
    throw new Error("BarcodeScanner -> Extra work not found");
  }

  const isActivityIdHobbyWithTj10 = getIsHobbyExtraWorkWithTj10(extraWork);
  const isActivityIdHobbyWithTj12 = getIsHobbyExtraWorkWithTj12(extraWork);
  const isActivityWithTj10OrTj12 =
    isActivityIdHobbyWithTj10 || isActivityIdHobbyWithTj12;

  const [isLoading, setIsLoading] = useState(false);
  const [isExtraWork230, setIsExtraWork230] = useState(
    extraWork.activityname.startsWith("230"),
  );

  //scan values
  const {
    isFieldScanned,
    isZPScanned,
    isForceToScanField,
    scannedValues,
    scannedZPOnManyFields,
    qrLock,

    setQrLock,
    scanValueHandler,
    clearScannedValues,
    deleteScannedValue,
    changePercentageOfScannedValue,
    clearZpOnManyFields,
  } = useScannedValues(setIsLoading, isExtraWork230, isRoz, isHobbyTech);

  //date value
  const [chosenDate, setChosenDate] = useState(new Date(Date.now()));

  //tj12 count input
  const {
    isShowModalWithTj12CountInput,
    tjQuantity,

    setIsShowModalWithTj12CountInput,
    changeTjQuantity,
  } = useInputTjQuantity();

  //select concentration
  const {
    isShowModalWithSelectConcentration,
    selectedProtectiveTreatment,

    setIsShowModalWithSelectConcentration,
    changeProtectiveTreatment,
  } = useSelectConcentration();

  //sending data
  const { sendExtraWork } = useSendExtraWorkData(
    setIsLoading,
    clearScannedValues,
    closeFn,
  );
  const sendDataHandler = () => {
    sendExtraWork(
      extraWork,
      scannedValues,
      chosenDate,
      selectedProtectiveTreatment,
      zpListWithOrderedNitrogenIrrigation,
      isHobbyTech,
      tjQuantity,
    );
  };

  //open delete modal
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal(false);
  const [isShowZpPercentageModal, setIsShowZpPercentageModal] =
    useShowModal(false);
  const [chosenZP, setChosenZP] = useState<ZpScannedValue>();

  const isPossibleToScan =
    (!isFieldScanned && !isExtraWork230) ||
    (!isFieldScanned && isExtraWork230 && scannedValues.length < 1) ||
    (!isFieldScanned && isHobbyTech && scannedValues.length < 1) ||
    (!isFieldScanned && isForceToScanField);
  const isNotPossibleToScanBecauseScannedWholeField = isFieldScanned;
  const isNotPossibleToScanBecauseOfRestrictionsWithWork230 =
    !isFieldScanned &&
    isExtraWork230 &&
    scannedValues.length > 0 &&
    !isForceToScanField;
  const isNotPossibleToScanBecauseOfRestrictionsWithWorkHobbyTech =
    !isFieldScanned &&
    isHobbyTech &&
    scannedValues.length > 0 &&
    !isForceToScanField;

  // send button disability
  const isSendButtonDisabled =
    scannedValues.length === 0 ||
    isForceToScanField ||
    (isExtraWork230 && !selectedProtectiveTreatment) ||
    (isHobbyTech && !tjQuantity && isActivityWithTj10OrTj12);
  // console.log("scannedValues.length === 0", scannedValues.length === 0);
  // console.log("isForceToScanField ", isForceToScanField);
  // console.log(
  //   "isExtraWork230 && !selectedProtectiveTreatment",
  //   isExtraWork230 && !selectedProtectiveTreatment,
  // );
  // console.log(
  //   "isHobbyTech && !tjQuantity && isActivityWithTj10OrTj12",
  //   isHobbyTech && !tjQuantity && isActivityWithTj10OrTj12,
  // );
  // console.log("isSendButtonDisabled", isSendButtonDisabled);

  // {"extraWork": {"activityname": "151 - Konfekcjonowanie GRU-HOBBY ECC12", "is_ordnmb": true, "ishobby": true, "istech": true, "keyval": 773247, "mobile_jm": null}}
  // {"extraWork": {"activityname": "242 - Konfekcjonowanie GRU-HOBBY ECC10", "is_ordnmb": true, "ishobby": true, "istech": true, "keyval": 30667238, "mobile_jm": null}}

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">{appPath}</View>
        <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
          <View className="h-[37vh] w-full relative">
            {Platform.OS === "android" ? <StatusBar hidden /> : null}
            <CameraView
              facing="back"
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={({ data }) => {
                if (data && !qrLock) {
                  scanValueHandler(data, extraWork.keyval);
                  setQrLock(true);
                }
              }}
            />

            <Overlay />
            {isPossibleToScan ? (
              <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                {qrLock ? (
                  <View className="flex-col items-center justify-center w-full h-full">
                    <View className="w-full px-16">
                      <View className="opacity-70">
                        <Button
                          title={
                            isForceToScanField
                              ? "skanuj kod lokalizacji"
                              : isHobbyTech
                                ? "skanuj ZP"
                                : "skanuj kod"
                          }
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
            ) : null}
            {isNotPossibleToScanBecauseScannedWholeField ? (
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
            {isNotPossibleToScanBecauseOfRestrictionsWithWork230 ? (
              <>
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
                  <Text className="text-center text-foreground font-default-bold">
                    {`Zeskanowano ZP'ka dla pracy: \n${extraWork.activityname}`}
                  </Text>
                  <Text className="text-center text-foreground font-default-normal">
                    Brak możliwości zeskanowania więcej niż jednego elementu.
                  </Text>
                </View>
              </>
            ) : null}
            {isNotPossibleToScanBecauseOfRestrictionsWithWorkHobbyTech ? (
              <>
                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
                <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-20">
                  <Text className="text-center text-foreground font-default-bold">
                    {`Zeskanowano ZP'ka dla technologicznej pracy hobby: \n${extraWork.activityname}`}
                  </Text>
                  <Text className="mt-4 text-center text-foreground font-default-normal">
                    Brak możliwości zeskanowania więcej niż jednego elementu.
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View
            className={clsx(
              "w-full ",
              isExtraWork230 || isHobbyTech ? "h-2" : "h-4",
            )}
          ></View>

          {!isForceToScanField ? (
            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              {isExtraWork230 ? (
                <View
                  className={clsx(
                    "flex-row items-center justify-between w-full",
                  )}
                >
                  <View className="mr-2">
                    <Text className="text-foreground font-default-bold">
                      Wybierz stężenie:
                    </Text>
                  </View>
                  <View className="flex-1">
                    <ButtonTextAndIcon
                      actionFn={() => {
                        setIsShowModalWithSelectConcentration(true);
                      }}
                      text={`${
                        selectedProtectiveTreatment
                          ? selectedProtectiveTreatment.dscrpt
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
                        selectedProtectiveTreatment
                          ? darkColor
                          : destructiveColor
                      }
                    />
                  </View>
                </View>
              ) : null}

              {isHobbyTech && isActivityWithTj10OrTj12 ? (
                <View
                  className={clsx(
                    "flex-row items-center justify-between w-full",
                  )}
                >
                  <View className="flex-row items-center justify-start gap-2 mr-6">
                    <Text
                      className={clsx(
                        "font-default-bold",
                        tjQuantity ? "text-foreground" : "text-destructive",
                      )}
                    >
                      {isActivityIdHobbyWithTj12
                        ? "Ilość TJ12:"
                        : "Ilość TJ10:"}
                    </Text>
                    <Text
                      className={clsx(
                        " font-main-menu",
                        tjQuantity ? "text-foreground" : "text-destructive",
                      )}
                    >
                      {tjQuantity ? tjQuantity : "-"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <ButtonTextAndIcon
                      actionFn={() => {
                        setIsShowModalWithTj12CountInput(true);
                      }}
                      text={`${tjQuantity ? `zmień ilość ${isActivityIdHobbyWithTj12 ? "TJ12" : "TJ10"} ` : `podaj ilość ${isActivityIdHobbyWithTj12 ? "TJ12" : "TJ10"}`}`}
                      icon={
                        <View className="ml-4">
                          <ChevronRight
                            size={24}
                            color={lightColor}
                            strokeWidth={2}
                          />
                        </View>
                      }
                      isBackground
                      isFull={false}
                      customColor={tjQuantity ? darkColor : destructiveColor}
                    />
                  </View>
                </View>
              ) : null}

              <View className="flex-col items-center w-full">
                {isExtraWork230 || isHobbyTech ? (
                  <>
                    <View className="flex-row items-center justify-center w-full mt-[10px] mb-[6px]">
                      <View className="w-24 h-[1px] bg-foreground"></View>
                    </View>
                    <Text className="text-foreground font-default-normal">
                      zeskanowane elementy dla:{" "}
                      <Text className="font-default-bold text-foreground">
                        {extraWork?.activityname}
                      </Text>
                    </Text>
                  </>
                ) : null}
                {!isExtraWork230 && !isHobbyTech ? (
                  <>
                    <Text className="text-foreground font-default-normal">
                      zeskanowane elementy dla:
                    </Text>
                    <Text className="font-default-bold text-foreground">
                      {extraWork?.activityname}
                    </Text>
                  </>
                ) : null}
              </View>

              {/* scanned zp list - start */}
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
                      {scannedValues.map((value) => (
                        <ZpItem
                          key={value.ordnmb}
                          zpValue={value}
                          deleteZpAction={() => {
                            setChosenZP(value);
                            setIsShowDeleteModal(true);
                          }}
                          changeZpPercentageAction={() => {
                            setChosenZP(value);
                            setIsShowZpPercentageModal(true);
                          }}
                          canPercentageBeChanged={!isFieldScanned}
                          isActive={isZPScanned}
                          isRoz={isRoz}
                          isActivityWithTj10OrTj12={isActivityWithTj10OrTj12}
                        />
                      ))}
                    </View>
                  </ScrollView>
                ) : null}
              </ContainerHorizontalRoundedFrame>
              {/* scanned zp list - end */}
            </View>
          ) : null}

          {isForceToScanField ? (
            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <View className="w-full mt-8">
                <Text className="text-center font-default-normal text-foreground">
                  Zeskanowano ZP, które znajduje się w kilku lokalizacjach.
                </Text>
                <Text className="text-center font-default-bold text-foreground">
                  {scannedZPOnManyFields.length > 0
                    ? scannedZPOnManyFields[0].ordnmb
                    : ""}
                </Text>
              </View>
              <View className="w-full">
                {scannedZPOnManyFields.map((item, index) => (
                  <View
                    className="flex-col items-start justify-start w-full"
                    key={index}
                  >
                    <Text className="w-full text-center text-foreground font-default-semibold">
                      {item.planam} -{" "}
                      <Text className="text-foreground font-default-normal">
                        ilość tac:{" "}
                        <Text className="text-foreground font-default-semibold">
                          {item.stkcnt_loc}
                        </Text>{" "}
                        z{" "}
                        <Text className="text-foreground font-default-semibold">
                          {item.stkcnt_ordnmb}
                        </Text>{" "}
                        (
                        {Math.round(
                          (item.stkcnt_loc / item.stkcnt_ordnmb) * 100,
                        )}{" "}
                        %)
                      </Text>
                    </Text>
                  </View>
                ))}
              </View>
              <View className="flex items-center justify-center w-full">
                <View className="px-4 py-2 mt-6 f bg-foreground rounded-app">
                  <Text className="font-default-bold text-background-nuance">
                    Zeskanuj kod lokalizacji.
                  </Text>
                </View>
              </View>

              <View className="w-full mt-6">
                <Button
                  handlePress={clearZpOnManyFields}
                  title="zrezygnuj"
                  isOutline
                />
              </View>
            </View>
          ) : null}

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              <ButtonTextAndThreeArrows
                actionFn={sendDataHandler}
                text="wyślij"
                isBackground
                disabled={isSendButtonDisabled}
              />
            </View>
            <View className="ml-6">
              <ButtonBack actionFn={closeFn} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* delete zp modal */}
      <ModalInternal
        isOpen={isShowDeleteModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <DeleteZpModal
          closeFn={() => setIsShowDeleteModal(false)}
          zpItem={chosenZP}
          actionFn={deleteScannedValue}
          isRoz={isRoz}
        />
      </ModalInternal>

      {/* change percentage in zp modal */}
      <ModalInternal
        isOpen={isShowZpPercentageModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ChangePercentageZpModal
          closeFn={() => setIsShowZpPercentageModal(false)}
          zpItem={chosenZP}
          actionFn={changePercentageOfScannedValue}
        />
      </ModalInternal>

      {/* select concentration of nitrogen modal */}
      <ModalInternal
        isOpen={isShowModalWithSelectConcentration}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <SelectConcentrationOfNitrogenModal
          closeFn={() => setIsShowModalWithSelectConcentration(false)}
          protectiveTreatments={nitrogenProtectiveTreatments}
          refreshAllData={refreshAllData}
          changeProtectiveTreatment={changeProtectiveTreatment}
          isLoading={isLoading}
        />
      </ModalInternal>

      {/* input tj quantity modal */}
      <ModalInternal
        isOpen={isShowModalWithTj12CountInput}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <TjQuantityModal
          closeFn={() => setIsShowModalWithTj12CountInput(false)}
          changeTj12Quantity={changeTjQuantity}
          extraWork={extraWork}
          tjQuantity={tjQuantity}
          isActivityIdHobbyWithTj10={isActivityIdHobbyWithTj10}
          isActivityIdHobbyWithTj12={isActivityIdHobbyWithTj12}
        />
      </ModalInternal>
    </View>
  );
};

export default BarcodeScanner;
