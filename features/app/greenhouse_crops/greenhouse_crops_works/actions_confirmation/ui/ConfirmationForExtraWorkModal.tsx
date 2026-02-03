import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
import { useGet_CheckIfZPExistsInThisActivityId } from "@/features/shared/data-access/useGet_CheckIfZPExistsInThisActivityId";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  ZpRozActivity,
  ZpRozWithActivities,
} from "@/features/shared/types/interfaces-activities_list";
import {
  ConfirmationForExtraWork_PostDTO,
  ConfirmationForExtraWorkResponse,
  ZpScannedValueToBeSent,
} from "@/features/shared/types/interfaces-extra_works";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  closeFn: () => void;
  currentActivity: ZpRozActivity | null;
  zp: ZpRozWithActivities | null;
  clearScannedValues: () => void;
  // openQuantityModal: (activityDetails: ZpRozActivityDetails) => void;
  // activityDetails: ZpRozActivityDetails[];
  // allActivities: ZpRozActivity[] | undefined;
  // refetchActivitiesData: () => Promise<void>;
};

export default function ConfirmationForExtraWorkModal(props: Props) {
  ////vars
  const { currentActivity, zp, closeFn, setIsLoading, clearScannedValues } =
    props;
  const checkIfZPExistsInThisActivityId =
    useGet_CheckIfZPExistsInThisActivityId();
  const { token } = useAuthSessionStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.EXTRA_WORK_IN_ACTIVITIES],
    queryFn: () =>
      checkIfZPExistsInThisActivityId(
        `ZLEC_${zp?.ordnmb}`,
        token,
        currentActivity!.activityid ? currentActivity!.activityid : 0,
        "zp_roz",
      ),
    enabled: zp && currentActivity ? true : false,
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      setIsLoading(true);
    }
    if (!isLoading && !isFetching) {
      setIsLoading(false);
    }
  }, [isLoading, isFetching, setIsLoading]);

  const canConfirmationBeSubmitted = false;

  // type ConfirmationForExtraWork_PostDTO = {
  //   activityid: number | null;
  //   scanned_raw_value: string;
  //   mobile: true;
  //   ordnmb_json: ZpScannedValueToBeSent[];
  // };
  // type ConfirmationForExtraWorkResponse = string[];

  const sendDataHandler = async () => {
    if (!currentActivity || !zp || !data || !data.length) {
      toast.error(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    const activityId = currentActivity.activityid;
    const scannedRawValue = zp.scannedRawValue;
    const dataToBeSend: ConfirmationForExtraWork_PostDTO[] = [
      {
        activityid: activityId,
        scanned_raw_value: scannedRawValue,
        mobile: true,
        ordnmb_json: data.map((item) => ({
          ...item,
          treatid: null,
          dscrpt: null,
          plan_id: null,
        })),
      },
    ];

    try {
      setIsLoading(true);

      let response: ConfirmationForExtraWorkResponse =
        await query_postDataAsServerAction<
          any,
          ConfirmationForExtraWork_PostDTO[]
        >(
          configPerBuild.apiAddress,
          "/api.php/REST/custom/czynnosciextradone",
          token!,
          dataToBeSend,
        );

      if (response && response.length === 0) {
        clearScannedValues();
        closeFn();
        toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.EXTRA_WORK_IN_ACTIVITIES],
        });
      } else {
        toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
      }
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  ////tsx
  return (
    <>
      <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
        <View className="relative w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <View className="flex-col items-center justify-between flex-1 w-full">
              <View className="w-full mt-32">
                <Text className="text-center font-nav text-foreground">
                  Potwierdzasz wykonanie czynności
                </Text>
                <View>
                  <View className="flex-row items-center justify-center w-full px-6 mt-4">
                    <Text className="font-default-normal text-foreground">
                      Zlecenie:{" "}
                    </Text>
                    <View className="ml-2">
                      <Text className="font-default-semibold text-foreground">
                        {zp?.ordnmb ? zp.ordnmb : "-"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-center w-full px-6">
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
                </View>
              </View>
              <View className="flex-1 w-full px-6 mt-4">
                {/* <ContainerHorizontalRoundedFrame>
 
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
                </ContainerHorizontalRoundedFrame> */}
              </View>

              <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                <View className="flex-1">
                  <ButtonTextAndThreeArrows
                    actionFn={sendDataHandler}
                    text="wyślij potwierdzenie"
                    isBackground
                    disabled={canConfirmationBeSubmitted}
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
}
