import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { router } from "expo-router";
import { View, Text, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/app/all_crops/extra_works_zp/ui/Overlay";
import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
} from "@/features/shared/types/interfaces-navigation";
import { useScanValuesForPottedPlantsComingUpsCounter } from "../domain/useScanValuesForPottedPlantsComingUpsCounter";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import images from "@/features/shared/constants/images";
import { Image } from "expo-image";
import { MESSAGES } from "@/features/shared/utils/messages";
import TrayItem from "@/features/app/field_crops/field_crops_works/plants_coming_ups_counter/ui/TrayItem";
import { Tray } from "@/features/shared/types/interfaces-tray";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ConfirmQuantitiesPlantsComingUpsCounterModal from "@/features/app/field_crops/field_crops_works/plants_coming_ups_counter/ui/ConfirmQuantitiesPlantsComingUpsCounterModal";
import DeleteTrayFromPlantsComingUpsCounterListModal from "@/features/app/field_crops/field_crops_works/plants_coming_ups_counter/ui/DeleteTrayFromPlantsComingUpsCounterListModal";

type Props = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const PottedPlants_PlantsComingUpsCounterScanner = (props: Props) => {
  ////vars
  const { isLoading, setIsLoading } = props;

  //scan values
  const {
    qrLock,
    trays,
    isShowModalWithTrayComingUpCounter,
    currentTray,
    isShowDeleteTrayModal,
    setQrLock,
    scanValueHandler,
    setIsShowModalWithTrayComingUpCounter,
    setIsShowDeleteTrayModal,
    sendValuesForPlantsComingUpsCounter,
    addOrChangeQuantityInPlantsComingUpsCounterHandler,
    addQuantityToExistingTrayHandler,
    setCurrentTray,
    deleteExistingTrayHandler,
  } = useScanValuesForPottedPlantsComingUpsCounter(setIsLoading);

  const openModalToUpdateTray = (tray: Tray) => {
    setCurrentTray(tray);
    setIsShowModalWithTrayComingUpCounter(true);
  };
  const openModalToDeleteTray = (tray: Tray) => {
    setCurrentTray(tray);
    setIsShowDeleteTrayModal(true);
  };

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
              POTTED_PLANTS_WORKS,
              { actionFn: () => {}, name: "Przeliczanie wschodów" },
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
                        title="skanuj tacę"
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

        <View className="flex-col items-center justify-between flex-1 w-full">
          {/* <View className="h-4"></View> */}
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
                      <TrayItem
                        key={tray.stk_id}
                        tray={tray}
                        actionFn={() => {
                          openModalToUpdateTray(tray);
                        }}
                        addQuantityToExistingTrayHandler={
                          addQuantityToExistingTrayHandler
                        }
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
                actionFn={sendValuesForPlantsComingUpsCounter}
                text="wyślij"
                isBackground
                disabled={trays.length === 0}
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

      {/* choose quantities -  modal */}
      <ModalInternal
        isOpen={isShowModalWithTrayComingUpCounter}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ConfirmQuantitiesPlantsComingUpsCounterModal
          closeFn={() => setIsShowModalWithTrayComingUpCounter(false)}
          tray={currentTray}
          addOrChangeQuantityInPlantsComingUpsCounterHandler={
            addOrChangeQuantityInPlantsComingUpsCounterHandler
          }
        />
      </ModalInternal>

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
        />
      </ModalInternal>
    </View>
  );
};

export default PottedPlants_PlantsComingUpsCounterScanner;
