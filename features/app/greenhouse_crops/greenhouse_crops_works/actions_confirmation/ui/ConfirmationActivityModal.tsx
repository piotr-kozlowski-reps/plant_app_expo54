import {
  ZpRozActivity,
  ZpRozActivityDetails,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetActivityData } from "../domain/useGetActivityData";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { MESSAGES } from "@/features/shared/utils/messages";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";
import MaterialQuantityItem from "./MaterialQuantityItem";
import { useSendActivityConfirmation } from "../domain/useSendActivityConfirmation";
import { checkIfActivityCanBeSet } from "@/features/shared/utils/checkIfActivityCanBeSet";
import { useEffect, useState } from "react";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  closeFn: () => void;
  currentActivity: ZpRozActivity | null;
  zp: ZpRozWithActivities | null;
  openQuantityModal: (activityDetails: ZpRozActivityDetails) => void;
  activityDetails: ZpRozActivityDetails[];
  allActivities: ZpRozActivity[] | undefined;
  refetchActivitiesData: () => Promise<void>;
};

const ConfirmationActivityModal = (props: Props) => {
  ////vars
  const {
    currentActivity,
    zp,
    activityDetails,
    closeFn,
    openQuantityModal,
    allActivities,
    setIsLoading,
    refetchActivitiesData,
  } = props;
  const isActivityConfirmed = !!currentActivity?.status;
  const isActivitySettable = checkIfActivityCanBeSet(
    currentActivity,
    allActivities
  );

  //handle refresh when data changed
  // const [isToRefresh, setIsToRefresh] = useState(false);
  // useEffect(() => {
  //   if (isToRefresh) {
  //     refresh();
  //     setIsToRefresh(false);
  //   }

  //   async function refresh() {
  //     await refetchActivitiesData();
  //   }
  // }, [isToRefresh]);

  const { sendActivityConfirmationHandler } = useSendActivityConfirmation(
    closeFn,
    setIsLoading
  );

  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <View className="flex-col items-center justify-between flex-1 w-full">
              <View className="w-full mt-4">
                <Text className="text-center font-nav text-foreground">
                  Parametry operacji
                </Text>
                <View>
                  <View className="flex-row items-center justify-start w-full px-6 mt-4">
                    <Text className="font-default-normal text-foreground">
                      Zlecenie:{" "}
                    </Text>
                    <View className="ml-2">
                      <Text className="font-default-semibold text-foreground">
                        {zp?.ordnmb ? zp.ordnmb : "brak"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-start w-full px-6">
                    <Text className=" font-default-normal text-foreground">
                      Czynność:{" "}
                    </Text>
                    <View className="ml-2">
                      <Text className="font-default-semibold text-foreground">
                        {currentActivity?.dscrpt
                          ? currentActivity.dscrpt
                          : "brak"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-start w-full px-6">
                    <Text className=" font-default-normal text-foreground">
                      Ilość zlecenia:{" "}
                    </Text>
                    <View className="ml-2">
                      <Text className="font-default-semibold text-foreground">
                        {currentActivity?.ilebeg
                          ? currentActivity.ilebeg
                          : "brak"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="flex-1 w-full px-6 mt-4">
                <ContainerHorizontalRoundedFrame>
                  {/* no activityData */}
                  {!activityDetails || activityDetails.length === 0 ? (
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
                            {MESSAGES.LACK_OF_ACTIVITY_DETAILS}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {/* activityData */}
                  {activityDetails.length > 0 ? (
                    <ScrollView className="w-full">
                      <View className="flex-row flex-wrap items-center justify-start py-4">
                        {activityDetails.map((item) => (
                          <MaterialQuantityItem
                            key={item.id}
                            activityDetails={item}
                            openQuantityModal={openQuantityModal}
                            isActivityConfirmed={isActivityConfirmed}
                            isActivitySettable={isActivitySettable}
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
                      sendActivityConfirmationHandler(
                        currentActivity,
                        activityDetails,
                        zp
                      )
                    }
                    text="wyślij"
                    isBackground
                    disabled={isActivityConfirmed || !isActivitySettable}
                  />
                </View>
                <View className="ml-6">
                  <ButtonBack actionFn={closeFn} isOutline={false} />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </>
  );
};
export default ConfirmationActivityModal;
