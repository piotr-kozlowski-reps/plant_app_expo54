import { lightColor } from "@/features/shared/constants/colorThemeVars";
import { ZpRozActivity } from "@/features/shared/types/interfaces-activities_list";
import { checkIfActivityCanBeSet } from "@/features/shared/utils/checkIfActivityCanBeSet";
import clsx from "clsx";
import { CheckCheck, CircleDashed } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  activity: ZpRozActivity;
  actionFn: (activity: ZpRozActivity) => void;
  allActivities: ZpRozActivity[];
};

const ActivityListItem = (props: Props) => {
  ////vars
  const { activity, actionFn, allActivities } = props;

  const isStatusSet = activity.status;
  const isActivitySettable = checkIfActivityCanBeSet(activity, allActivities);

  return (
    <TouchableOpacity
      className={clsx(
        "h-[64px] flex-row items-center justify-between  rounded-app mb-4  px-6",
        isStatusSet ? "bg-green shadow-sm" : "",
        !isStatusSet && isActivitySettable
          ? "bg-foreground shadow-sm"
          : "bg-gray opacity-80"
      )}
      activeOpacity={0.7}
      onPress={() => actionFn(activity)}
    >
      <View className="mr-4">
        {isStatusSet ? (
          <CheckCheck color={lightColor} strokeWidth={3} size={18} />
        ) : null}
        {!isStatusSet ? (
          <CircleDashed color={lightColor} strokeWidth={3} size={18} />
        ) : null}
      </View>
      <View className="flex-1">
        <View className="flex-col items-start justify-center">
          <View>
            <Text className={clsx("font-default-bold text-background-nuance")}>
              {activity.dscrpt}
            </Text>
          </View>
          <View>
            <Text
              className={clsx("font-default-normal text-background-nuance")}
            >
              {`${activity.ilebeg} ${
                isStatusSet ? `(${activity.iledne})` : ``
              }`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityListItem;
