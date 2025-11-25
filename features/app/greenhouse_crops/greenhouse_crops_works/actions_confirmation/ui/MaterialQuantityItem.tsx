import { lightColor } from "@/features/shared/constants/colorThemeVars";
import {
  ZpRozActivity,
  ZpRozActivityDetails,
} from "@/features/shared/types/interfaces-activities_list";
import Button from "@/features/shared/ui/button/Button";
import { checkIfActivityCanBeSet } from "@/features/shared/utils/checkIfActivityCanBeSet";
import clsx from "clsx";
import { CheckCheck, CircleDashed } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  activityDetails: ZpRozActivityDetails;
  openQuantityModal: (activityDetails: ZpRozActivityDetails) => void;
  isActivityConfirmed: boolean;
  isActivitySettable: boolean;
};

const MaterialQuantityItem = (props: Props) => {
  ////vars
  const {
    activityDetails,
    openQuantityModal,
    isActivityConfirmed,
    isActivitySettable,
  } = props;

  ////tsx
  return (
    <>
      <TouchableOpacity
        className={clsx(
          "min-h-[64px] flex-row items-center justify-between rounded-app mb-4  px-6 pt-[10px] pb-4",
          isActivityConfirmed ? "bg-green shadow-sm" : "",
          !isActivityConfirmed && isActivitySettable
            ? "bg-foreground shadow-sm"
            : "bg-gray"
          // !isActivityConfirmed ? "bg-foreground" : "bg-green"
        )}
        activeOpacity={1}
      >
        <View className="mr-4">
          {isActivityConfirmed ? (
            <CheckCheck color={lightColor} strokeWidth={3} size={18} />
          ) : null}
          {!isActivityConfirmed ? (
            <CircleDashed color={lightColor} strokeWidth={3} size={18} />
          ) : null}
        </View>
        <View className="flex-1">
          <View className="flex-col items-start justify-center">
            <View>
              <Text
                className={clsx("font-default-normal text-background-nuance ")}
              >
                Materiał:
              </Text>
              <Text
                className={clsx("font-default-bold text-background-nuance")}
              >
                {activityDetails.dscrpt}
              </Text>
            </View>
            <View className="flex-row items-center justify-start gap-2 mt-2">
              <Text
                className={clsx("font-default-normal text-background-nuance")}
              >
                Ilość:
              </Text>
              <Text
                className={clsx("font-default-bold text-background-nuance")}
              >
                {`${activityDetails.iledne}`}
              </Text>
            </View>

            <View
              className={clsx(
                "w-full mt-4",
                isActivityConfirmed ? "opacity-50" : "opacity-100"
              )}
            >
              <Button
                title="zmień ilość"
                handlePress={
                  isActivityConfirmed || !isActivitySettable
                    ? () => {}
                    : () => openQuantityModal(activityDetails)
                }
                disabled={isActivityConfirmed || !isActivitySettable}
                isWhite
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default MaterialQuantityItem;
