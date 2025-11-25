import { toast } from "sonner-native";
import { useCheckWhatValueIsScannedHelpers } from "../utils/useCheckWhatValueIsScannedHelpers";
import { ERROR_MESSAGES } from "../utils/messages";
import {
  TrayToBeDestroyedInfo,
  TrayToBeDestroyedInfoDTO,
} from "../types/interfaces-destroy_tray";
import { configPerBuild } from "../env/env";
import { query_getDataAsServerAction } from "../utils/commonHelpers/queryGetOnServer";
import useAuthSessionStore from "../stores/useAuthSessionStore";

export const useScanTrayToBeDestroyedRep84 = () => {
  const { checkWhatValueWasScanned, getPureTrayValue } =
    useCheckWhatValueIsScannedHelpers();
  const { token } = useAuthSessionStore();
  // const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  // const { errorHandler } = useErrorHandler();

  async function scanTrayToBeDestroyedRep84(
    scannedValue: string
  ): Promise<TrayToBeDestroyedInfo | null> {
    const whatValueWasScanned = checkWhatValueWasScanned(scannedValue);
    if (whatValueWasScanned !== "tray") {
      toast.warning(
        ERROR_MESSAGES.WRONG_PARAMETER +
          "-> " +
          whatValueWasScanned +
          " -> scanZpOrTrayForOrderToHardenerHandler"
      );
      return null;
    }

    let foundItem: TrayToBeDestroyedInfoDTO | null = null;
    const trayId = getPureTrayValue(scannedValue);
    const query = `/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_TrayToBeDestroyed}&stk_id='${trayId}'&module=GRUNT`;

    //fetch
    foundItem = await query_getDataAsServerAction<TrayToBeDestroyedInfoDTO>(
      configPerBuild.apiAddress,
      query,
      token!
    );

    if (
      !foundItem?.data?.resultMainQuery ||
      foundItem?.data?.resultMainQuery === -1
    )
      return null;

    const dataDTO = foundItem.data.resultMainQuery[0];
    const dataToPass: TrayToBeDestroyedInfo = {
      doc_id: dataDTO.doc_id ? parseInt(dataDTO.doc_id) : null,
      ordnmb: dataDTO.ordnmb,
      stk_id: dataDTO.stk_id,
    };

    return dataToPass;
  }

  return { scanTrayToBeDestroyedRep84 };
};
