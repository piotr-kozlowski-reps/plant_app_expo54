import { ExtraWork } from "../types/interfaces-extra_works";

export const getIsHobbyExtraWorkWithTj10 = (
  value: ExtraWork | number,
): boolean => {
  const activityId = 773246;
  if (typeof value === "number") return value === activityId;
  return value.keyval === activityId;
};
export const getIsHobbyExtraWorkWithTj12 = (
  value: ExtraWork | number,
): boolean => {
  const activityId = 30667241;
  if (typeof value === "number") return value === activityId;
  return value.keyval === activityId;
};
