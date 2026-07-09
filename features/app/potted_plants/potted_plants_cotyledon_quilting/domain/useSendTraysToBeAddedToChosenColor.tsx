import {
  CotyledonQuilting,
  CotyledonQuiltingAddingTraysPostDTO,
  CotyledonQuiltingResponse,
} from "@/features/shared/types/interfaces-cotyledon_quilting";
import { TrayShortInfo } from "@/features/shared/types/interfaces-tray";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { toast } from "sonner-native";
import * as Network from "expo-network";
import { router } from "expo-router";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";

export const useSendTraysToBeAddedToChosenColor = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  chosenColor: CotyledonQuilting | null,
  resetTrays: () => void,
) => {
  ////vars
  const { token } = useAuthSessionStore();

  ////fn
  const sendTraysToBeAddedToChosenColor = async (trays: TrayShortInfo[]) => {
    if (!trays || trays.length === 0) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_CHOSEN_TRAYS);
      return;
    }

    if (!chosenColor) {
      toast.error(ERROR_MESSAGES.NO_INFO_ABOUT_CHOSEN_COLOR);
      return;
    }

    try {
      setIsLoading(true);
      const ip = await Network.getIpAddressAsync();
      const dataToSent: CotyledonQuiltingAddingTraysPostDTO[] = [
        {
          ip,
          sordid: chosenColor.sordid,
          ordnmb: chosenColor.ordnmb,
          twr_kod: chosenColor.twr_kod,
          // quantity: values.quantity,
          twr_nazwa: chosenColor.twr_nazwa,
          cid: chosenColor.cid,
          mid: chosenColor.mid,
          trays: trays.map((tray) => ({
            stk_id: tray.stk_id,
            scanned_raw_value: tray.scanned_raw_value,
          })),
        },
      ];
      await sendToServer(dataToSent);
      toast.success(MESSAGES.SEND_DATA_WITH_SUCCESS, {
        id: MESSAGES.SEND_DATA_WITH_SUCCESS,
      });
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {
        id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA,
      });
    } finally {
      resetTrays();
      setIsLoading(false);
      router.push("/app/potted_plants/potted_plants_cotyledon_quilting");
    }
  };

  //helpers
  async function sendToServer(
    dataToBeSend: CotyledonQuiltingAddingTraysPostDTO[],
  ) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT, {
        id: ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT,
      });
      return;
    }

    //send data to server
    /**
     * @public
     * @transformApiItem
     * Wysyłka tac, by podpiąć je do wybranego koloru w ZP roślin doniczkowych - custom api:
     * <b>{{URL}}</b>/api.php/REST/custom/<b>addstktoorderdon</b>
     * dane - array obiektów:
     * [
     *  {
     *     ip: string;
     *     sordid: number;
     *     ordnmb: string;
     *     twr_kod: string;
     *     twr_nazwa: string;
     *     cid: number;
     *     mid: number;
     *     trays: [
     *        stk_id: number
     *        scanned_raw_value: string
     *     ]
     *   }
     * ]
     * @separator
     */
    let response: CotyledonQuiltingResponse =
      await query_postDataAsServerAction<
        CotyledonQuiltingResponse,
        CotyledonQuiltingAddingTraysPostDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/addstktoorderdon",
        token!,
        dataToBeSend,
      );

    // console.log(response);

    //check if response array has the same amount of items as sent items
    // const responseIDsQuantity = response.length;
    // const sentItemsQuantity = 1;

    // console.log({ responseIDsQuantity });
    // console.log({ sentItemsQuantity });

    // if (responseIDsQuantity === sentItemsQuantity) {
    //   toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY, {id: MESSAGES.DATA_SENT_SUCCESSFULLY });
    // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUTS_LIST] });
    // closeFn();
    // }
    // if (responseIDsQuantity !== sentItemsQuantity) {
    //   toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA});
    // }
  }

  ////hook
  return { sendTraysToBeAddedToChosenColor };
};
