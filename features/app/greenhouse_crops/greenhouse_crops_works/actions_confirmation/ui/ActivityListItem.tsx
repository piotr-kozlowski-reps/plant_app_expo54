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

  const isTech = activity.type__ === "TECH";
  const isExtra = activity.type__ === "EXTRA";
  const isTechActivityDone = !!(activity.status && activity.type__ === "TECH");
  const isExtraActivityDone = !!(
    activity.type__ === "EXTRA" &&
    activity.status === null &&
    activity.donedat
  );
  const isExtraActivityNeverEvenPlanned =
    activity.type__ === "EXTRA" &&
    activity.status === null &&
    !activity.donedat &&
    !activity.plndat;
  const isActivitySettable = checkIfActivityCanBeSet(activity, allActivities);

  let isActivityDone: boolean = false;
  if (isTech) isActivityDone = isTechActivityDone;
  if (isExtra) isActivityDone = isExtraActivityDone;
  if (!isTech && !isExtra)
    throw new Error("ActivityListItem => !isTech && !isExtra");

  return (
    <TouchableOpacity
      className={clsx(
        "h-[64px] flex-row items-center justify-between  rounded-app mb-4  px-6",
        isActivityDone ? "bg-green shadow-sm" : "",
        !isActivityDone && isActivitySettable
          ? "bg-foreground shadow-sm"
          : "bg-gray opacity-80",
        isExtraActivityNeverEvenPlanned ? "bg-cyan-600" : "",
      )}
      activeOpacity={0.7}
      onPress={() => actionFn(activity)}
    >
      <View className="mr-4">
        {isActivityDone ? (
          <CheckCheck color={lightColor} strokeWidth={3} size={18} />
        ) : null}
        {!isActivityDone ? (
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
                isTechActivityDone ? `(${activity.iledne})` : ``
              }`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityListItem;
