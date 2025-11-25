import { lightColor } from "@/features/shared/constants/colorThemeVars";
import { Localization } from "@/features/shared/types/interfaces-localization";
import {
  GENERAL_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChoosingLogicForWateringPlants } from "../domain/useChoosingLogicForWateringPlants";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import {
  GeneralWork,
  Post_GeneralWork_DTO,
} from "@/features/shared/types/interfaces-general_works";
import { toast } from "sonner-native";
import { useGetEdocCustomRegisterMutation } from "@/features/shared/utils/getEdocCustomRegister/useGetEdocCustomRegisterMutation";

import ButtonTextAndConfirmationIcon from "@/features/shared/ui/button/ButtonTextAndConfirmationIcon";
import { customRegister_GeneralWorks } from "@/features/shared/data-access/customRegister_GeneralWorks";

type Props = {
  closeFn: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  localizaction: Localization | null;
  wateringPlantsActivity: GeneralWork | undefined;
  scannedRawValue: string | null;
};

const ChooseFieldDetailsModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    setIsLoading,
    localizaction,
    wateringPlantsActivity,
    scannedRawValue,
  } = props;
  const { POSTasyncMutation: send_GeneralWorks_PostMutation } =
    useGetEdocCustomRegisterMutation({
      customRegister: customRegister_GeneralWorks,
    });

  //choosing logic
  const { a, b, c, all, isSendingAvailable, setChosenValue } =
    useChoosingLogicForWateringPlants();

  //fn
  const sendWateringPlantsData = async () => {
    if (!a && !b && !c && !all) {
      toast.warning(ERROR_MESSAGES.NOTHING_WAS_CHOSEN);
      return;
    }
    if (!wateringPlantsActivity) {
      toast.warning(ERROR_MESSAGES.WATERING_PLANT_ACTIVITY_NOT_DELIVERED);
      return;
    }
    if (!localizaction) {
      toast.warning(ERROR_MESSAGES.NO_INFO_ABOUT_LOCALIZATION);
      return;
    }

    const dataToBeSent: Post_GeneralWork_DTO = {
      activityid: wateringPlantsActivity.keyval,
      donedat: new Date(Date.now()),
      mobile: true,
      params_json: [
        {
          a,
          b,
          c,
          all,
          planam: localizaction.planam,
          id____: localizaction.id____,
          scanned_raw_value: scannedRawValue!,
        },
      ],
    };

    try {
      setIsLoading(true);
      await send_GeneralWorks_PostMutation(dataToBeSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS);
    } catch (error) {
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    } finally {
      setIsLoading(false);
      closeFn();
    }
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
                GENERAL_WORKS,
                { actionFn: () => {}, name: "Podlewanie roślin" },
              ]}
            />
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            <View className="flex-col items-center justify-center flex-1 w-full">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-l-normal">
                    Wybrana lokalizacja:{" "}
                  </Text>
                </View>
                <View>
                  <Text className="font-nav text-foreground">
                    {localizaction?.planam}
                  </Text>
                </View>
              </View>

              <View className="flex-col items-center justify-center w-full gap-4 px-6 mt-6">
                <View className="w-full">
                  <ButtonTextAndConfirmationIcon
                    actionFn={() => setChosenValue(!a, "a")}
                    text="A"
                    isCheckedValue={a}
                  />
                </View>
                <View className="w-full">
                  <ButtonTextAndConfirmationIcon
                    actionFn={() => setChosenValue(!b, "b")}
                    text="B"
                    isCheckedValue={b}
                  />
                </View>
                <View className="w-full">
                  <ButtonTextAndConfirmationIcon
                    actionFn={() => setChosenValue(!c, "c")}
                    text="C"
                    isCheckedValue={c}
                  />
                </View>
              </View>

              <View className="flex-row items-center justify-center w-full mt-6 mb-6">
                <View className="w-24 h-[1px] bg-foreground"></View>
              </View>

              <View className="w-full px-6">
                <ButtonTextAndConfirmationIcon
                  actionFn={() => setChosenValue(!all, "all")}
                  text="Całość"
                  isCheckedValue={all}
                />
              </View>
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={sendWateringPlantsData}
                  text="wyślij"
                  isBackground
                  disabled={!isSendingAvailable}
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
  );
};
export default ChooseFieldDetailsModal;
