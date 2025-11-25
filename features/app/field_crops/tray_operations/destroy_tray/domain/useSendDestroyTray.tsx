import { useIsSendingDataAvailable } from "@/features/app/all_crops/order_export_to_customer/domain/useIsSendingDataAvailable";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  DestroyTrayResponse,
  ImageDTO,
  Post_DestroyTray_DTO,
  TrayInfoWithPics,
} from "@/features/shared/types/interfaces-destroy_tray";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { CameraCapturedPicture } from "expo-camera";
import { toast } from "sonner-native";

export const useSendDestroyTray = (
  scannedValue: TrayInfoWithPics | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  resetValues: () => void
) => {
  const { isSendingDataAvailable } = useIsSendingDataAvailable(scannedValue);
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();

  async function sendValuesForDestroyTrayHandler() {
    if (!scannedValue || scannedValue.pictures.length < 2) {
      toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
      return;
    }

    const dataToSent: Post_DestroyTray_DTO[] = [
      {
        ordnmb: scannedValue.ordnmb,
        stk_id: scannedValue.stk_id,
        scanned_raw_value: scannedValue.scannedRawValue,
        pictures: preparePicturesForSending(
          scannedValue.pictures,
          scannedValue.stk_id
        ),
      },
    ];

    try {
      setIsLoading(true);
      await sendToServer(dataToSent);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  //helpers
  async function sendToServer(dataToBeSend: Post_DestroyTray_DTO[]) {
    if (!dataToBeSend || dataToBeSend.length < 1) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }
    //send data to server
    let response: DestroyTrayResponse = await query_postDataAsServerAction<
      DestroyTrayResponse,
      Post_DestroyTray_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/destroystickers",
      token!,
      dataToBeSend
    );

    //check if response array has the same amount of items as sent items
    const sentItemsQuantity = dataToBeSend[0].pictures.length;
    const responseIDsQuantity = response.length;

    if (responseIDsQuantity === sentItemsQuantity) {
      toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
      resetValues();
    }
    if (responseIDsQuantity !== sentItemsQuantity) {
      toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
    }
  }

  return { sendValuesForDestroyTrayHandler, isSendingDataAvailable };
};

function preparePicturesForSending(
  pictures: CameraCapturedPicture[],
  stk_id: string
): ImageDTO[] {
  const preparedPictures: ImageDTO[] = pictures.map((picture, index) => ({
    fileName: `${stk_id}_${index}.png`,
    fileContent: picture.base64!,
    transferEncoding: "base64",
  }));

  return preparedPictures;
}
