import {
  ExtraWork,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import {
  ProtectiveTreatment,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { StatusBar } from "expo-status-bar";
import { View, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import ZpItem from "@/features/app/field_crops/extra_works_zp/ui/ZpItem";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useState } from "react";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import DeleteZpModal from "@/features/app/field_crops/extra_works_zp/ui/DeleteZpModal";
import { useSendProtectiveTreatmentHandler } from "../domain/useSendProtectiveTreatmentHandler";
import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";

type Props = {
  scannedValues: ZpScannedValue[];
  isLoading: boolean;
  quantity: number | null;
  treatment: ProtectiveTreatment | null;
  extraWork: ExtraWork | null;
  who: WhoDidProtectiveTreatment | null;
  qrLock: boolean;
  isForceToScanField: boolean;
  isFieldScanned: boolean;
  isZPScanned: boolean;
  closeFn: () => void;
  setQrLock: React.Dispatch<React.SetStateAction<boolean>>;
  scanValueHandler: (scannedValue: string, activityId: number) => Promise<void>;
  deleteScannedValue: (value: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  clearScannedValues: () => void;
  scannedZPOnManyFields: ZpScannedValue[];
  clearZpOnManyFields: () => void;
  restOfLocalizations: RestOfLocalizationsDespiteOfOneChosen[];
  isInformUserThatThereAreAnotherLocalizationsOfTreatedZP: boolean;
  resetInfoAboutRestOfLocalizations: () => void;
  setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  clearForm: () => void;
};

const ProtectiveTreatmentScannerModal = (props: Props) => {
  //vars
  const {
    scannedValues,
    isLoading,
    qrLock,
    isForceToScanField,
    isFieldScanned,
    extraWork,
    treatment,
    quantity,
    who,
    isZPScanned,
    scannedZPOnManyFields,
    restOfLocalizations,
    isInformUserThatThereAreAnotherLocalizationsOfTreatedZP,

    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    setQrLock,
    closeFn,
    scanValueHandler,
    deleteScannedValue,
    setIsLoading,
    clearScannedValues,
    clearZpOnManyFields,
    resetInfoAboutRestOfLocalizations,
    clearForm,
  } = props;

  //open delete modal
  const [isShowDeleteModal, setIsShowDeleteModal] = useShowModal(false);
  const [chosenZP, setChosenZP] = useState<ZpScannedValue>();

  /** sending protective treatment data */
  //date value - starting of whole process - state set on beginnig of component start
  const [startOfProcessDate, setStartOfProcessDate] = useState(
    new Date(Date.now())
  );
  const sendProtectiveTreatmentDataHandler = useSendProtectiveTreatmentHandler(
    setIsLoading,
    clearScannedValues,
    closeFn,
    clearForm
  );

  if (!extraWork || !treatment || !who || !quantity) {
    return (
      <View>
        <Text>Brak wystarczającej ilości informacji, by kontynuować.</Text>
      </View>
    );
  }

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
              FIELD_CROPS_WORKS,
              { actionFn: () => {}, name: "Zabieg ochronny" },
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
                  scanValueHandler(data, extraWork.keyval);

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
                          title={
                            isForceToScanField
                              ? "skanuj kod lokalizacji"
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
          <View className="h-4"></View>
          <View className="w-full h-2"></View>

          {!isForceToScanField ? (
            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <View className="flex-col items-center w-full">
                <View>
                  <Text className="text-foreground font-default-normal">
                    zeskanowane elementy dla:
                  </Text>
                </View>
                <View>
                  <Text className="font-default-bold text-foreground">
                    {extraWork?.activityname}
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      Zabieg:{" "}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-default-bold text-foreground">
                      {treatment?.dscrpt}{" "}
                    </Text>
                  </View>
                  <View className="ml-4">
                    <Text className="text-foreground font-default-normal">
                      Ilość środka:{" "}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-default-bold text-foreground">
                      {quantity}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-center">
                  <View className="ml-4">
                    <Text className="text-foreground font-default-normal">
                      Wykonał:{" "}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-default-bold text-foreground">
                      {who}
                    </Text>
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
                            // setIsShowZpPercentageModal(true); //TODO: check if I need to handle it
                          }}
                          canPercentageBeChanged={!isFieldScanned}
                          isActive={isZPScanned}
                        />
                      ))}
                    </View>
                  </ScrollView>
                ) : null}
              </ContainerHorizontalRoundedFrame>
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
                          (item.stkcnt_loc / item.stkcnt_ordnmb) * 100
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
                actionFn={() =>
                  sendProtectiveTreatmentDataHandler({
                    extraWork,
                    scannedValues,
                    begin_date: startOfProcessDate,
                    treatment,
                    quantity,
                    who,
                    restOfLocalizations,
                    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
                  })
                }
                text="wyślij"
                isBackground
                disabled={scannedValues.length === 0 || isForceToScanField}
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
        />
      </ModalInternal>
    </View>
  );
};

export default ProtectiveTreatmentScannerModal;
