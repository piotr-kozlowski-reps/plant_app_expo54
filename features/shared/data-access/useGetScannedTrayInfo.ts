import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";

export const useGetScannedTrayInfo = () => {
  ////vars
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();

  ////fn
  async function getScannedTrayInfo(scannedValue: string) {
    const scannedStk_id = getPureTrayValue(scannedValue);

    console.log({ scannedStk_id });

    //   //fetch data
    //   /**
    //    * @public
    //    * @procedureItem
    //    * raporty:
    //    * @readFile `features/shared/data-access/useGetTrayInfo_Report113.tsx`
    //    */
    //   const trayInfo = await getTrayInfo_Rep113(
    //     token!,
    //     scannedValue,
    //     errorHandler,
    //   );
    //   if (!trayInfo) return;
    //   //to process tray further property "lckcnt" must be null or -1
    //   /**
    //    * @public
    //    * @guard
    //    *  w raporcie znajduje się pole: <b>lckcnt</b>
    //   - jeżeli wartość jest inna niż: <b>-1</b> lub <b>null</b> to komunikat, mówiący o tym, że dane dla tej tacy zostały już wprowadzone.
    //    */
    //   const isPossibleToPressTray =
    //     trayInfo.lckcnt === null || trayInfo.lckcnt === -1;
    //   if (!isPossibleToPressTray) {
    //     toast.error(
    //       `Dla tej tacy (${scannedStk_id}) wprowadzono już ilość braków (${trayInfo.lckcnt}).`,
    //     );
    //     return;
    //   }
    //   setCurrentTray(trayInfo);
    //   setIsShowModalWithTrayComingUpCounter(true);
  }

  ////hook return
  return {
    getScannedTrayInfo,
  };
};
