import { useGetReportDamagedTrays_Report92 } from "@/features/shared/data-access/useGetReportDamagedTrays_Report92";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { ReportDamagedTrays } from "@/features/shared/types/interfaces-report_damaged_trays";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useEffect, useState } from "react";

export const useGetReportDamagedTraysData = (
  selectedDate: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  isMine: boolean
) => {
  //vars
  const { getReportDamagedTrays_Report92 } =
    useGetReportDamagedTrays_Report92();
  const { errorHandler } = useErrorHandler();
  const { user } = useAuthSessionStore();

  //state
  const [reportDamagedTrays, setReportDamagedTrays] = useState<
    ReportDamagedTrays[]
  >([]);

  const getReportDamagedTrays = async () => {
    try {
      setIsLoading(true);
      const reportDamagedTrays = await getReportDamagedTrays_Report92(
        selectedDate
      );

      if (!reportDamagedTrays || !user) {
        return [];
      }

      let reportDamagedTraysFiltered = reportDamagedTrays;
      //filter if it's mine only
      if (isMine) {
        const userId = user.id;
        reportDamagedTraysFiltered = reportDamagedTrays.filter((item) => {
          return item.dstuid === userId;
        });
      }

      setReportDamagedTrays(
        reportDamagedTraysFiltered ? reportDamagedTraysFiltered : []
      );
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      getReportDamagedTrays();
    }
  }, [selectedDate, isMine]);

  //fn
  const refreshAllData = () => {
    getReportDamagedTrays();
  };

  //hook return
  return { reportDamagedTrays, refreshAllData };
};
