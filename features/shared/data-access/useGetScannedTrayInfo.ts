import useAuthSessionStore from "../stores/useAuthSessionStore";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";
import { useErrorHandler } from "../utils/useErrorHandler";
import { useGetTrayInfo_Report113 } from "./useGetTrayInfo_Report113";

export const useGetScannedTrayInfo = () => {
  ////vars
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getTrayInfo_Rep113 } = useGetTrayInfo_Report113();
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  ////fn
  async function getScannedTrayInfo(scannedValue: string) {
    //fetch data
    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/useGetTrayInfo_Report113.tsx`
     */
    const trayInfo = await getTrayInfo_Rep113(
      token!,
      scannedValue,
      errorHandler,
    );
    if (!trayInfo) return null;

    return trayInfo;
  }

  ////hook return
  return {
    getScannedTrayInfo,
  };
};
