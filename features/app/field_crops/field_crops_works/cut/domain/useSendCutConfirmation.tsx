// import { QUERY_KEYS } from "@/features/shared/constants/queryKeys";
// import { configPerBuild } from "@/features/shared/env/env";
// import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
// import {
//   CutConfirmationResponse,
//   Post_CutConfirmation_DTO,
//   ZpToCut,
// } from "@/features/shared/types/interfaces-cut";
// import { ZPShortenedInfo } from "@/features/shared/types/interfaces-zp";
// import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
// import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner-native";

// export const useSendCutConfirmation = (
//   scannedValue: ZPShortenedInfo | null,
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   cutsList: ZpToCut[],
//   closeFn: () => void
// ) => {
//   const { user, token } = useAuthSessionStore();
//   const queryClient = useQueryClient();

//   async function sendCutConfirmation() {
//     if (!scannedValue || !cutsList || !user) {
//       toast.error(ERROR_MESSAGES.NO_INFO_TO_SEND);
//       return;
//     }

//     const foundZpToCutFromList = cutsList.find(
//       (zp) => zp.ordnmb === scannedValue.ordnmb
//     );
//     if (!foundZpToCutFromList) {
//       toast.error(ERROR_MESSAGES.CANNOT_CONFIRM_ZP_WAS_NOT_ORDERED);
//       return;
//     }
//     //// TODO:
//     const dataToSent: Post_CutConfirmation_DTO[] = [
//       {
//         cutuid: user.id,
//         cutdat: new Date(Date.now()),
//         height: 0,
//         id____: foundZpToCutFromList.id____,
//         scanned_raw_value: scannedValue.scanned_raw_value,
//       },
//     ];

//     await sendToServer(dataToSent);
//   }

//   //helpers
//   async function sendToServer(dataToBeSend: Post_CutConfirmation_DTO[]) {
//     if (!dataToBeSend) {
//       toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
//       return;
//     }

//     //send data to server
//     let response: CutConfirmationResponse = await query_postDataAsServerAction<
//       CutConfirmationResponse,
//       Post_CutConfirmation_DTO[]
//     >(
//       configPerBuild.apiAddress,
//       "/api.php/REST/custom/cuts",
//       token!,
//       dataToBeSend
//     );

//     //check if response array has the same amount of items as sent items
//     const responseIDsQuantity = response.length;
//     const sentItemsQuantity = 1;

//     if (responseIDsQuantity === sentItemsQuantity) {
//       toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
//       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUTS_LIST] });
//       closeFn();
//     }
//     if (responseIDsQuantity !== sentItemsQuantity) {
//       toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
//     }
//   }

//   return { sendCutConfirmation };
// };
