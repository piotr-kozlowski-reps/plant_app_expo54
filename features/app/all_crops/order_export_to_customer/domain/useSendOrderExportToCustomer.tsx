import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import {
  AttachmentsRequest,
  AttachmentsResponse,
} from "@/features/shared/types/interfaces-attachments";
import { toast } from "sonner-native";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useBaseAPI_URL_Store } from "@/features/shared/stores/useBaseAPI_URL_Store";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import {
  OrderExportToCustomerResponse,
  OrderExportToCustomerSendDataDTO,
} from "@/features/shared/types/interfaces-orders_all";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";

import { configPerBuild } from "@/features/shared/env/env";
import { useIsSendingOrderExportToCustomerDataAvailable } from "./useIsSendingOrderExportToCustomerDataAvailable";
import { AllExportToCustomerSubmodules } from "@/features/shared/types/interfaces-auth";
import { useCreateDocId } from "@/features/shared/data-access/useCreateDocId";

type OrderExportToCustomerDataToSent = {
  scannedValue: ZPShortenedInfoWithPics;
  inHowManyDays: number;
  isSuperData: boolean;
};

export const useSendOrderExportToCustomer = (
  scannedValue: ZPShortenedInfoWithPics | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void,
  submoduleType: AllExportToCustomerSubmodules
) => {
  const { isSendingDataAvailable } =
    useIsSendingOrderExportToCustomerDataAvailable(scannedValue, submoduleType);
  const { token } = useAuthSessionStore();
  const { baseURL } = useBaseAPI_URL_Store();
  const { errorHandler } = useErrorHandler();
  const { addDaysToDate } = useDatesHelper();
  const { createDocId } = useCreateDocId();

  async function sendValuesForOrderExportToCustomerHandler(
    scannedValue: ZPShortenedInfoWithPics,
    inHowManyDays: number,
    isSuperData: boolean
  ) {
    try {
      setIsLoading(true);

      await sendDataToServer({ scannedValue, inHowManyDays, isSuperData });

      //
    } catch (error) {
      console.error(error);
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendDataToServer(
    valuesToSendOrderToHardener: OrderExportToCustomerDataToSent
  ) {
    ////guards
    const isScannedValue = valuesToSendOrderToHardener.scannedValue;
    const arePicturesInAppropriateAmount =
      submoduleType === "field_crops_works_order_export_to_customer"
        ? valuesToSendOrderToHardener.scannedValue.pictures.length
        : true;
    const inHowManyDays = valuesToSendOrderToHardener.inHowManyDays;

    if (!isScannedValue || !arePicturesInAppropriateAmount || !inHowManyDays) {
      toast.warning(ERROR_MESSAGES.CANNOT_SEND_PICTURES);
      return;
    }

    const scannedValueLocal = valuesToSendOrderToHardener.scannedValue;
    const inHowManyDaysLocal = valuesToSendOrderToHardener.inHowManyDays;
    const isSuperDataLocal = valuesToSendOrderToHardener.isSuperData;

    let docId = "";
    if (submoduleType === "field_crops_works_order_export_to_customer") {
      //doc id
      const docIdResponse = await createDocId(
        token!,
        {
          // prtpid: 3,
          dctpid: 27,
          prc_id: scannedValueLocal.prc_id,
          dscrpt: `ZDJĘCIE ROŚLIN PRZED WYSŁANIEM ${scannedValueLocal.ordnmb}`,
        },
        errorHandler
      );

      if (!docIdResponse) {
        toast.error(ERROR_MESSAGES.PROBLEM_WITH_CREATING_DOCID);
        return;
      }

      docId = docIdResponse.doc_id;

      //attachments
      for (const pic of scannedValueLocal.pictures) {
        const fileToBeSent: AttachmentsRequest = {
          attachments: {
            file_0: {
              fileName: `${scannedValueLocal.ordnmb}_${(
                Math.floor(Math.random() * 10000) + 10000
              )
                .toString()
                .substring(1)}.png`,
              fileContent: pic.base64!,
              transferEncoding: "base64",
              prc_id: scannedValueLocal.prc_id,
              dscrpt: `ZDJĘCIE ROŚLIN PRZED WYSŁANIEM ${scannedValueLocal.ordnmb}`,
              dcpid: 27,
            },
          },
        };

        const response = await query_postDataAsServerAction<
          AttachmentsResponse,
          AttachmentsRequest
        >(
          baseURL,
          `/api.php/REST/v1/documents/${docId}/attachments`,
          token!,
          fileToBeSent
        );

        if (!response || !response.fileid || response.fileid.length !== 1) {
          throw new Error(
            "useSendOrderExportToCustomer ->  sendAttachments -> response is wrong."
          );
        }
      }
    }

    //send order export to customer data
    const orderExportToCustomer: OrderExportToCustomerSendDataDTO = {
      sordid: scannedValueLocal.sordid,
      ordnmb: scannedValueLocal.ordnmb,
      mov_to: null,
      movtyp: "OUT",
      movdta: addDaysToDate(
        new Date(Date.now()),
        inHowManyDaysLocal ? inHowManyDaysLocal : 0
      ),
      movspc: isSuperDataLocal ? 1 : 0,
      doc_id: docId,
      scanned_raw_value: scannedValueLocal.scannedRawValue,
    };

    //send data to server
    let response: OrderExportToCustomerResponse =
      await query_postDataAsServerAction<
        OrderExportToCustomerResponse,
        OrderExportToCustomerSendDataDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/movementsplan",
        token!,
        [orderExportToCustomer]
      );

    // toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
    // resetValues();

    // check if response array has the same amount of items as sent items
    // const responseIDsQuantity = response.length;
    // const sentItemsQuantity = 1;

    if (response) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
      resetValues();
    }
    if (!response) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }

  return { sendValuesForOrderExportToCustomerHandler, isSendingDataAvailable };
};
