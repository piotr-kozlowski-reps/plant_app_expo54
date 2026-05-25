import { CameraView } from "expo-camera";
import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_COTYLEDON_QUILTING,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import images from "@/features/shared/constants/images";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { View, Text, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForAddingTraysToPottedPlants } from "../domain/useScanValuesForAddingTraysToPottedPlants";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { MESSAGES } from "@/features/shared/utils/messages";
import { TrayShortInfo } from "@/features/shared/types/interfaces-tray";
import CotyledonQuilting_TrayItem from "./CotyledonQuilting_TrayItem";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import DeleteTrayFromPlantsComingUpsCounterListModal from "@/features/app/field_crops/field_crops_works/plants_coming_ups_counter/ui/DeleteTrayFromPlantsComingUpsCounterListModal";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { CotyledonQuilting } from "@/features/shared/types/interfaces-cotyledon_quilting";
import CotyledonQuilting_QuantityAndSend_Modal from "./CotyledonQuilting_QuantityAndSend_Modal";

type Props = {
  closeFn: () => void;
  ordnmb: string | null;
  chosenColor: CotyledonQuilting | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cotyledonQuiltingArray: CotyledonQuilting[];
};

export const CotyledonQuilting_AddingTrays_Modal = (props: Props) => {
  ////vars
  const { closeFn, setIsLoading, ordnmb, chosenColor, cotyledonQuiltingArray } =
    props;

  //scan values
  const {
    qrLock,
    trays,
    isShowDeleteTrayModal,
    currentTray,
    isShowQuantityAndSendModal,

    setQrLock,
    scanValueHandler,
    setIsShowDeleteTrayModal,
    setIsShowQuantityAndSendModal,
    setCurrentTray,
    deleteExistingTrayHandler,
  } = useScanValuesForAddingTraysToPottedPlants(
    setIsLoading,
    cotyledonQuiltingArray,
    chosenColor,
  );

  const openModalToDeleteTray = (tray: TrayShortInfo) => {
    setCurrentTray(tray);
    setIsShowDeleteTrayModal(true);
  };

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative w-full h-full">
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                POTTED_PLANTS,
                POTTED_PLANTS_COTYLEDON_QUILTING,
                { actionFn: () => {}, name: "Skanuj tace" },
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
                          title="skanuj tace"
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

          <View className="flex-row items-center justify-center w-full px-6 mt-4 ">
            <Text className=" font-default-normal text-foreground">
              podpinasz tace do:{" "}
            </Text>
            <View className="ml-2">
              <Text className=" font-default-semibold text-foreground">
                {ordnmb ? ordnmb : "-"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-center w-full px-6 ">
            <Text className=" font-default-normal text-foreground">
              kolor:{" "}
            </Text>
            <View className="ml-2">
              <Text className="font-default-semibold text-foreground">
                {chosenColor?.twr_nazwa}
              </Text>
            </View>
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className="w-full h-2"></View>

            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <ContainerHorizontalRoundedFrame>
                {trays.length === 0 ? (
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

                {trays.length > 0 ? (
                  <ScrollView className="w-full">
                    <View className="flex-row flex-wrap items-center justify-start py-4">
                      {trays.map((tray) => (
                        <CotyledonQuilting_TrayItem
                          key={tray.stk_id}
                          tray={tray}
                          openDeleteModal={() => openModalToDeleteTray(tray)}
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
                  actionFn={() => setIsShowQuantityAndSendModal(true)}
                  text="Podaj ilość i wyślij"
                  isBackground
                  disabled={trays.length === 0}
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
      </View>

      {/* delete tray from the list -  modal */}
      <ModalInternal
        isOpen={isShowDeleteTrayModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <DeleteTrayFromPlantsComingUpsCounterListModal
          closeFn={() => setIsShowDeleteTrayModal(false)}
          tray={currentTray}
          deleteExistingTrayHandler={deleteExistingTrayHandler}
          isShowLacksInfo={false}
          titleText={"Czy chcesz usunąć tacę z listy?"}
        />
      </ModalInternal>

      {/* quantity and send -  modal */}
      <ModalInternal
        isOpen={isShowQuantityAndSendModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <CotyledonQuilting_QuantityAndSend_Modal
          closeFn={() => setIsShowQuantityAndSendModal(false)}
          ordnmb={ordnmb}
          chosenColor={chosenColor}
          trays={trays}
          setIsLoading={setIsLoading}
        />
      </ModalInternal>
    </View>
  );
};

export default CotyledonQuilting_AddingTrays_Modal;
