import { toast } from "sonner-native";
import {
  ActivityConfirmationResponse,
  ZpPotActivityConfirmationWithPics_DTO,
} from "../types/interfaces-activities_list";
import { ERROR_MESSAGES, MESSAGES } from "../utils/messages";
import { configPerBuild } from "../env/env";
import { query_postDataAsServerAction } from "../utils/commonHelpers/queryPostOnServer";

export async function sendPotsPottingConfirmationWithPicturesToServer(
  dataToBeSend: ZpPotActivityConfirmationWithPics_DTO,
  token: string,
) {
  if (!dataToBeSend) {
    toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
    return;
  }

  //send data to server
  let response: ActivityConfirmationResponse =
    await query_postDataAsServerAction<
      ActivityConfirmationResponse,
      ZpPotActivityConfirmationWithPics_DTO[]
    >(
      configPerBuild.apiAddress,
      "/api.php/REST/custom/czynnoscidonedon",
      token!,
      [dataToBeSend],
    );

  if (response && response.length) {
    toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
  }
}
