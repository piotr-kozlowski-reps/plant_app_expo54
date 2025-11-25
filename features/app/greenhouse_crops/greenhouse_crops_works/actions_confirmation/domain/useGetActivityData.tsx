import { useGetActivityDetailsRep144 } from "@/features/shared/data-access/useGetActivityDetailsRep144";
import {
  ZpRozActivity,
  ZpRozActivityDetails,
} from "@/features/shared/types/interfaces-activities_list";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useEffect, useState } from "react";

export const useGetActivityData = (
  currentActivity: ZpRozActivity | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [activityDetails, setActivityDetails] = useState<
    ZpRozActivityDetails[]
  >([]);
  const { getActivityDetails_Report144 } = useGetActivityDetailsRep144();
  const { errorHandler } = useErrorHandler();

  useEffect(() => {
    if (!currentActivity) return;

    getActivityData(currentActivity.pcz_id);
  }, [currentActivity]);

  async function getActivityData(pcz_id: number) {
    try {
      setIsLoading(true);
      const activityDetails = await getActivityDetails_Report144(
        pcz_id,
        errorHandler
      );

      setActivityDetails(activityDetails || []);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    let isUpdated = false;
    const activityDataCopy = [...activityDetails];
    for (let i = 0; i < activityDataCopy.length; i++) {
      if (activityDataCopy[i].id === id) {
        activityDataCopy[i].iledne = newQuantity;
        isUpdated = true;
      }
    }

    setActivityDetails(activityDataCopy);

    if (!isUpdated) {
      throw new Error(
        "useGetActivityData -> updateQuantity -> not updated, id was not found"
      );
    }
  };

  return { activityDetails, updateQuantity };
};
