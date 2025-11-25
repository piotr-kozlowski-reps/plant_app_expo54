import { View, Text, ScrollView } from "react-native";
import { useScanValuesForWorksPlanning } from "../domain/useScanValuesForWorksPlanning";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  GREENHOUSE_CROPS,
  GREENHOUSE_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import {
  lightColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import WorkToPlanModal from "./WorkToPlanModal";
import {
  WorksPlanningVariant,
  WorkToPlan,
} from "@/features/shared/types/interfaces-works_planning";

import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonTextAndIcon from "@/features/shared/ui/button/ButtonTextAndIcon";
import { ChevronDown } from "lucide-react-native";
import HowManyDaysToPlanWorkModal from "./HowManyDaysToPlanWorkModal";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import { useSendWorkToPlanInGreenhouseCrops } from "../domain/useSendWorkToPlanInGreenhouseCrops";
import ZPItemInWorksPlanningInfo from "./ZPItemInWorksPlanningInfo";
import DeleteZpForOrdersAllModal from "@/features/app/all_crops/orders_all/ui/DeleteZpForOrdersAllModal";
import { useMemo } from "react";
import CameraScanner from "@/features/shared/ui/camera_view_scanner/CameraScanner";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  availableWorks: WorkToPlan[];
  refreshAllData: () => void;
  variant: WorksPlanningVariant;
};

const GreenhouseCropsWorksPlanningScanner = (props: Props) => {
  ////vars
  const { setIsLoading, isLoading, availableWorks, refreshAllData, variant } =
    props;

  //handle scanner and values logic
  const {
    isShowModalWorkToChoose,
    workToPlan,
    inHowManyDays,
    isShowModalWithInHowManyDays,
    scannedValues,
    isShowDeleteModal,
    ZPSelected,

    setZPSelected,
    setIsShowDeleteModal,
    setIsShowModalWithInHowManyDays,
    scanValueHandler,
    setIsShowModalWorkToChoose,
    setTargetWorkToPlanHandler,
    changeInHowManyDaysHandler,
    clearScannedValues,
    deleteValueFromList,
  } = useScanValuesForWorksPlanning(setIsLoading, variant);

  /** delete item from list handler */
  const deleteItemFromListHandler = () => {
    deleteValueFromList(ZPSelected);
  };

  //send data
  const sendWorkToPlanInGreenhouseCropsHandler =
    useSendWorkToPlanInGreenhouseCrops(setIsLoading, clearScannedValues, () =>
      setIsShowModalWorkToChoose(true)
    );

  const appPathName = useMemo(() => {
    return variant === "greenhouse_crops_works_works_planning_tomato"
      ? "Planowanie prac - pomidor"
      : "Planowanie prac - ogórek";
  }, [variant]);

  ////tsx
  return (
    <View className="relative w-full h-full">
      {!isShowModalWorkToChoose ? (
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                GREENHOUSE_CROPS,
                GREENHOUSE_CROPS_WORKS,
                { actionFn: () => {}, name: appPathName },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
            <CameraScanner
              scanButtonText="skanuj ZP"
              scanValueHandler={scanValueHandler}
              heightMultiplication={0.37}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className="w-full h-2"></View>

            <View className="flex-col items-start justify-start flex-1 w-full px-6">
              <View className="flex-col items-center w-full mb-[4px]">
                <View className="flex-row items-center justify-between w-full gap-1">
                  <View className="flex-row items-center justify-start flex-1 mr-2">
                    <View>
                      <Text className="text-foreground font-default-normal">
                        Praca:{" "}
                      </Text>
                    </View>
                    <View className="px-6 ml-1 bg-background-nuance rounded-app">
                      <Text className="font-nav text-foreground">
                        {workToPlan?.ptc_kod}
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
                        <ZPItemInWorksPlanningInfo
                          key={zpInfo.ordnmb}
                          zpInfo={zpInfo}
                          inHowManyDays={inHowManyDays}
                          setIsShowDeleteModal={setIsShowDeleteModal}
                          setZPSelected={setZPSelected}
                          // setIsShowDeleteModal={setIsShowDeleteModal}
                          // setZPSelected={setZPSelected}
                          // isPossibleToDeleteItem={!isFieldScanned}
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
                    sendWorkToPlanInGreenhouseCropsHandler({
                      scannedValues,
                      inHowManyDays,
                      workToPlan,
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
                    setIsShowModalWorkToChoose(true);
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
        isOpen={isShowModalWorkToChoose}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <WorkToPlanModal
          closeFn={() => setIsShowModalWorkToChoose(false)}
          availableWorks={availableWorks}
          refreshAllData={refreshAllData}
          isLoading={isLoading}
          setTargetWorkToPlan={setTargetWorkToPlanHandler}
          appPathName={appPathName}
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
        <HowManyDaysToPlanWorkModal
          closeFn={() => setIsShowModalWithInHowManyDays(false)}
          changeInHowManyDaysHandler={changeInHowManyDaysHandler}
        />
      </ModalInternal>
    </View>
  );
};
export default GreenhouseCropsWorksPlanningScanner;
