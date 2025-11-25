import { toast } from "sonner-native";
import { ZPDetailedInfo } from "../types/interfaces-zp";
import { TypeOfScannedValue } from "../types/interfaces-general";
import { ERROR_MESSAGES } from "../utils/messages";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";

import useAuthSessionStore from "../stores/useAuthSessionStore";
import { useErrorHandler } from "../utils/useErrorHandler";
import { useGetZPInfo_Report113 } from "./useGetZPInfo_Report113";

export const useScanZpOrTrayRep113 = () => {
  const { getPureZPValue, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  async function scanZpOrTrayRep113(
    scannedValue: string,
    whatValueWasScanned: TypeOfScannedValue
  ): Promise<ZPDetailedInfo | null> {
    if (whatValueWasScanned !== "zp_gru" && whatValueWasScanned !== "tray") {
      toast.warning(
        ERROR_MESSAGES.WRONG_PARAMETER +
          "-> " +
          whatValueWasScanned +
          " -> scanZpOrTrayForOrderToHardenerHandler"
      );
      return null;
    }

    let foundItem: ZPDetailedInfo | null = null;
    if (whatValueWasScanned === "zp_gru") {
      const scannedOrdnmb = getPureZPValue(scannedValue);

      //fetch
      foundItem = await getZPInfo_Rep113(token!, scannedOrdnmb, errorHandler);
    }
    if (whatValueWasScanned === "tray") {
      const trayId = getPureTrayValue(scannedValue);

      //fetch
      foundItem = await getZPInfo_Rep113(token!, trayId, errorHandler);
    }

    if (!foundItem) {
      toast.warning(ERROR_MESSAGES.NOT_FOUND_IN_LOC);
      return null;
    }

    return foundItem;
  }

  return { scanZpOrTrayRep113 };
};
