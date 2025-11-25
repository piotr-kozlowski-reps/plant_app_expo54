import { ZpRozActivity } from "../types/interfaces-activities_list";

export function checkIfActivityCanBeSet(
  activity: ZpRozActivity | null,
  allActivities: ZpRozActivity[] | undefined
): boolean {
  // if (!activity) throw new Error("checkIfActivityCanBeSet -> !activity");
  // if (!allActivities)
  //   throw new Error("checkIfActivityCanBeSet -> !allActivities");
  if (!activity || !allActivities) return false;

  const isStatusSet = activity.status;
  const isActivityEnabled = activity.enabled;
  const activityIndex = allActivities.findIndex(
    (act) => act.id === activity.id
  );
  const isFirstActivity = activityIndex === 0;

  if (isStatusSet) return false;
  if (isActivityEnabled || isFirstActivity) return true;

  const previousActivity = allActivities[activityIndex - 1];
  if (!previousActivity) {
    throw new Error("canActivityBeSet -> !previousActivity");
  }

  return previousActivity.status !== null;
}
