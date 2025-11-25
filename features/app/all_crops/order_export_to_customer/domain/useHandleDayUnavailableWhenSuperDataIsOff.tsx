import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useEffect } from "react";
import { toast } from "sonner-native";

export const useHandleDayUnavailableWhenSuperDataIsOff = (
  isDayAvailable: boolean,
  isSuperData: boolean,
  setIsShowModalWithInHowManyDays: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  scannedValue: ZPShortenedInfoWithPics | null
) => {
  useEffect(() => {
    if (!isDayAvailable && !isSuperData && scannedValue) {
      toast.warning(ERROR_MESSAGES.DAY_UNAVAILABLE_WITHOUT_SUPERDATA);
      setIsShowModalWithInHowManyDays(true);
    }
  }, [isDayAvailable, isSuperData, scannedValue]);
};
