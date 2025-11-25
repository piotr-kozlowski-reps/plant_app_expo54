import {
  GREENHOUSE_CROPS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import CameraScanner from "@/features/shared/ui/camera_view_scanner/CameraScanner";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForGreenhouseCropsActionsConfirmation } from "../domain/useScanValuesForGreenhouseCropsActionsConfirmation";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { FlatList } from "react-native-gesture-handler";
import {
  ActivityVariant,
  ZpRozActivity,
} from "@/features/shared/types/interfaces-activities_list";
import ActivityListItem from "./ActivityListItem";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ConfirmationActivityModal from "./ConfirmationActivityModal";
import ActivityQuantityModal from "./ActivityQuantityModal";
import { useGetActivityData } from "../domain/useGetActivityData";

type Props = {
  variant: ActivityVariant;
};

const GreenhouseCropsActionsConfirmationScanner = (props: Props) => {
  ////vars
  const { variant } = props;
  const [isLoading, setIsLoading] = useState(false);

  const {
    scannedValue,
    currentActivity,
    isShowConfirmActivityModal,
    isShowQuantityModal,
    currentActivityDetails,

    scanValueHandler,
    openActionConfirmationModal,
    closeActionConfirmationModal,
    openActivityQuantityModal,
    closeActivityQuantityModal,
    goBackToScanner,
    refetchActivitiesData,
  } = useScanValuesForGreenhouseCropsActionsConfirmation(setIsLoading, variant);

  const { activityDetails, updateQuantity } = useGetActivityData(
    currentActivity,
    setIsLoading
  );

  const appPathName = useMemo(() => {
    return variant === "greenhouse_crops_works_activity_confirmation_tomato"
      ? "Potwierdzanie czynności - pomidor"
      : "Potwierdzanie czynności - ogórek";
  }, [variant]);

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}

        {!scannedValue ? (
          <SafeAreaView className="flex-1 w-full">
            <View className="w-full px-6 mt-8">
              <AppPath
                paths={[
                  INDEX,
                  GREENHOUSE_CROPS,
                  { actionFn: () => {}, name: appPathName },
                ]}
              />
            </View>

            <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
              <CameraScanner
                scanButtonText="skanuj ZP"
                scanValueHandler={scanValueHandler}
              />

              <View className="mt-8 ">
                <Text className="text-center font-nav text-destructive">
                  zeskanuj kod zlecenia
                </Text>
              </View>
            </View>

            <View className="flex-1"></View>

            <View className="w-full mb-6">
              <ButtonBack isOutline={false} />
            </View>
          </SafeAreaView>
        ) : null}

        {scannedValue ? (
          <SafeAreaView className="flex-1 w-full">
            <View className="w-full px-6 mt-8">
              <AppPath
                paths={[
                  INDEX,
                  GREENHOUSE_CROPS,
                  { actionFn: () => {}, name: "Potwierdzanie czynności" },
                ]}
              />
            </View>

            <View className="w-full h-6 opacity-35"></View>

            <View className="flex-row items-center justify-start w-full pl-6">
              <View>
                <Text className="mb-2 font-default-semibold text-foreground">
                  Zlecenie:
                </Text>
              </View>
              <View className="ml-2">
                <Text className="mb-2 font-nav text-foreground">
                  {scannedValue.ordnmb}
                </Text>
              </View>
            </View>

            <View className="w-full h-2 opacity-35"></View>

            <View className="w-full pl-6">
              <Text className="mb-2 font-default-semibold text-background-nuance">
                Czynności:
              </Text>
            </View>

            <View className="flex-1 w-full px-6">
              <FlatList<ZpRozActivity>
                data={scannedValue.activities}
                renderItem={({ item }: { item: ZpRozActivity }) => (
                  <ActivityListItem
                    activity={item}
                    actionFn={openActionConfirmationModal}
                    allActivities={scannedValue.activities}
                  />
                )}
                // refreshing={isLoading}
                // onRefresh={refreshAllData}
                initialNumToRender={10}
              />
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1"></View>
              <View className="ml-6">
                <ButtonBack isOutline={false} actionFn={goBackToScanner} />
              </View>
            </View>
          </SafeAreaView>
        ) : null}

        {/* choose activity details -  modal */}
        <ModalInternal
          isOpen={isShowConfirmActivityModal}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <ConfirmationActivityModal
            setIsLoading={setIsLoading}
            closeFn={closeActionConfirmationModal}
            currentActivity={currentActivity}
            zp={scannedValue}
            openQuantityModal={openActivityQuantityModal}
            activityDetails={activityDetails}
            allActivities={scannedValue?.activities}
            refetchActivitiesData={refetchActivitiesData}
          />
        </ModalInternal>

        {/* choose quantities -  modal */}
        <ModalInternal
          isOpen={isShowQuantityModal}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <ActivityQuantityModal
            closeFn={closeActivityQuantityModal}
            updateQuantity={updateQuantity}
            activityDetails={currentActivityDetails}
            currentActivity={currentActivity}
            zp={scannedValue}
          />
        </ModalInternal>
      </View>
    </>
  );
};

export default GreenhouseCropsActionsConfirmationScanner;
