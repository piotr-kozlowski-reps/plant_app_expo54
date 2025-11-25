import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import {
  ExtraWork,
  Post_ExtraWork_ZP_DTO,
  ZpScannedValue,
} from "@/features/shared/types/interfaces-extra_works";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentSendDataDTO,
  ProtectiveTreatmentsResponse,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { toast } from "sonner-native";

type ProtectiveTreatmentDataToSent = {
  extraWork: ExtraWork;
  scannedValues: ZpScannedValue[];
  begin_date: Date;
  treatment: ProtectiveTreatment;
  quantity: number;
  who: WhoDidProtectiveTreatment;
  restOfLocalizations: RestOfLocalizationsDespiteOfOneChosen[];
  setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export const useSendProtectiveTreatmentHandler = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  clearScannedValues: () => void,
  closeFn: () => void,
  clearForm: () => void
) => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { token } = useAuthSessionStore();

  //fn
  const sendProtectiveTreatmentDataHandler = async (
    valuesToSendProtectiveTreatments: ProtectiveTreatmentDataToSent
  ) => {
    const {
      extraWork,
      scannedValues,
      begin_date,
      treatment,
      quantity,
      who,
      restOfLocalizations,
      setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    } = valuesToSendProtectiveTreatments;

    if (!extraWork || !scannedValues.length || !begin_date) {
      if (!extraWork) toast.error(ERROR_MESSAGES.LACK_OF_EXTRA_WORK);
      if (!scannedValues.length) toast.error(ERROR_MESSAGES.LACK_OF_ZP);
      if (!begin_date) toast.error(ERROR_MESSAGES.LACK_OF_DATE);
      return;
    }

    const protectiveTreatmentDataToBeSent: ProtectiveTreatmentSendDataDTO[] =
      [];
    scannedValues.forEach((scannedZP) => {
      const protectiveTreatmentItem: ProtectiveTreatmentSendDataDTO = {
        sordid: scannedZP.sordid,
        ordnmb: scannedZP.ordnmb,
        stkcnt: scannedZP.stkcnt_loc,
        ...getTreatmentDataToBeSent(
          treatment,
          getProperValueOfTreatmentTraysInAllZPs(
            quantity,
            scannedZP,
            scannedValues
          ),
          who
        ),
        planam: scannedZP.planam,
        activityid: extraWork.keyval,
        prev_percentage: scannedZP.prev_percentage,
        stkcnt_loc: scannedZP.stkcnt_loc,
        stkcnt_ordnmb: scannedZP.stkcnt_ordnmb,
        act_percentage: scannedZP.act_percentage,
        scanned_raw_value: scannedZP.scanned_raw_value,
      };

      protectiveTreatmentDataToBeSent.push(protectiveTreatmentItem);
    });

    try {
      setIsLoading(true);
      await sendToServer(protectiveTreatmentDataToBeSent);

      if (restOfLocalizations.length) {
        setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP(true);
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
      clearScannedValues();
      closeFn();
    }
  };

  return sendProtectiveTreatmentDataHandler;

  //helpers
  async function sendToServer(dataToBeSend: ProtectiveTreatmentSendDataDTO[]) {
    if (!dataToBeSend) {
      toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
      return;
    }

    //send data to server
    let response: ProtectiveTreatmentsResponse;
    try {
      setIsLoading(true);

      response = await query_postDataAsServerAction<
        ProtectiveTreatmentsResponse,
        ProtectiveTreatmentSendDataDTO[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/treatment",
        token!,
        dataToBeSend
      );

      //check if response array has the same amount of items as sent items
      const responseIDsQuantity = response.length;
      const sentItemsQuantity = dataToBeSend.length;

      if (responseIDsQuantity === sentItemsQuantity) {
        toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
        clearForm();
      }
      if (responseIDsQuantity !== sentItemsQuantity) {
        toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
      }
    } catch (error) {
      console.error(error);
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  function getTreatmentDataToBeSent(
    treatment: ProtectiveTreatment,
    quantity: number,
    who: WhoDidProtectiveTreatment
  ): Pick<ProtectiveTreatmentSendDataDTO, "tretid" | "lvalue" | "is_aut"> {
    return {
      tretid: treatment.id____,
      lvalue: quantity,
      is_aut: who === "ROBOT" ? true : false,
    };
  }

  function getProperValueOfTreatmentTraysInAllZPs(
    quantity: number,
    scannedZP: ZpScannedValue,
    scannedValues: ZpScannedValue[]
  ): number {
    const allTraysCount = scannedValues.reduce((acc, item) => {
      return acc + item.stkcnt_loc;
    }, 0);
    const currentTraysCount = scannedZP.stkcnt_loc;

    const lValueForCurrentZP = (
      (currentTraysCount * quantity) /
      allTraysCount
    ).toFixed(2);

    return Number.parseFloat(lValueForCurrentZP);
  }
};

// async function sendValuesForProtectiveTreatment(
//   quantity: number,
//   treatment: ProtectiveTreatment,
//   treatmentType: ExtraWork,
//   who: WhoDidProtectiveTreatment
// ): Promise<void> {
//   if (!quantity || !treatment || !treatmentType || !who) {
//     toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
//   }

//   const isScannedLocalization =
//     localization && localizationsWhenScannedField && !ZP;
//   const isScannedZPOrTrayWithFewLocalizations = localization && ZP;
//   const isScannedZPOrTrayWithOneLocalization = !localization && ZP;

//   if (isScannedLocalization) {
//     const dataToBeSend: ProtectiveTreatmentSendDataDTO[] = [];

//     localizationsWhenScannedField.forEach((item) => {
//       const isOnlyOneLocalization = item.localization.length === 1;
//       const isMoreLocalizationsPerZP = item.localization.length > 1;

//       if (isOnlyOneLocalization) {
//         const currentTocalization = item.localization[0];

//         const dataToBeSendItem: ProtectiveTreatmentSendDataDTO = {
//           sordid: item.sordid,
//           ordnmb: item.ordnmb,
//           stkcnt: currentTocalization.ile,

//           ...getTreatmentDataToBeSent(treatment, quantity, who),

//           planam: currentTocalization.planam,
//           activityid: treatmentType.keyval,
//         };

//         dataToBeSend.push(dataToBeSendItem);
//       }
//       if (isMoreLocalizationsPerZP) {
//         const currentLocalization = item.localization.find(
//           (loc) => loc.planam === localization.planam
//         );
//         if (!currentLocalization) {
//           throw new Error(
//             "isMoreLocalizationsPerZP => currentLocalization -> is not found"
//           );
//         }

//         const dataToBeSendItem: ProtectiveTreatmentSendDataDTO = {
//           sordid: item.sordid,
//           ordnmb: item.ordnmb,
//           stkcnt: currentLocalization.ile,

//           ...getTreatmentDataToBeSent(treatment, quantity, who),

//           planam: currentLocalization.planam,
//           activityid: treatmentType.keyval,
//         };

//         dataToBeSend.push(dataToBeSendItem);
//       }
//     });

//     //send data
//     await sendToServer(dataToBeSend);

//     //handle info about rest of localizations to be treated
//     const isAnyLocalizationInMoreThanOnePlace =
//       localizationsWhenScannedField.some(
//         (item) => item.localization.length > 1
//       );
//     if (isAnyLocalizationInMoreThanOnePlace) {
//       const ZPsWithLocalizationsMoreThanOne =
//         localizationsWhenScannedField.filter(
//           (item) => item.localization.length > 1
//         );
//       const ZPsWithRestOfLocalizations = ZPsWithLocalizationsMoreThanOne.map(
//         (item) => {
//           const ordnmb = item.ordnmb;
//           const restOfLocalizations = item.localization.filter(
//             (loc) => loc.planam !== localization.planam
//           );
//           return {
//             ordnmb,
//             restOfLocalizations: restOfLocalizations.map(
//               (locInn) => locInn.planam
//             ),
//           };
//         }
//       );
//       setRestOfLocalizations(ZPsWithRestOfLocalizations);
//       setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP(true);
//       resetValuesToScanNextItem();
//       return;
//     }

//     if (!isAnyLocalizationInMoreThanOnePlace) {
//       resetValuesToScanNextItem();
//       return;
//     }
//   }

//   if (isScannedZPOrTrayWithFewLocalizations) {
//     const dataToBeSend: ProtectiveTreatmentSendDataDTO[] = [
//       {
//         sordid: ZP.ordid_,
//         ordnmb: ZP.ordnmb,
//         stkcnt: findTraysAmountPerLocalization(
//           localizationsWhenScannedField,
//           ZP,
//           localization
//         ),

//         ...getTreatmentDataToBeSent(treatment, quantity, who),

//         planam: localization.planam,
//         activityid: treatmentType.keyval,
//       },
//     ];
//     await sendToServer(dataToBeSend);

//     //handle info about rest of localizations to be treated
//     const restOfLocalizationsFiltered = ZP.localization.filter((loc) => {
//       return loc.id____ !== localization.id____;
//     });
//     const restOfLocalizations: RestOfLocalizationsDespiteOfOneChosen[] = [
//       {
//         ordnmb: ZP.ordnmb,
//         restOfLocalizations: restOfLocalizationsFiltered.map(
//           (loc) => loc.dscrpt
//         ),
//       },
//     ];
//     setRestOfLocalizations(restOfLocalizations);
//     setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP(true);
//     resetValuesToScanNextItem();
//     return;
//   }

//   if (isScannedZPOrTrayWithOneLocalization) {
//     const dataToBeSend: ProtectiveTreatmentSendDataDTO[] = [
//       {
//         sordid: ZP.ordid_,
//         ordnmb: ZP.ordnmb,
//         stkcnt: ZP.stkcnt,

//         ...getTreatmentDataToBeSent(treatment, quantity, who),

//         planam: ZP.localization[0].dscrpt,
//         activityid: treatmentType.keyval,
//       },
//     ];

//     await sendToServer(dataToBeSend);
//     resetValuesToScanNextItem();
//     return;
//   }

// if (localizationsWhenScannedField && localization) {
//   const isAnyLocalizationInMoreThanOnePlace =
//     localizationsWhenScannedField.some(
//       (item) => item.localization.length > 1
//     );
//   if (isAnyLocalizationInMoreThanOnePlace) {
//     const ZPsWithLocalizationsMoreThanOne =
//       localizationsWhenScannedField.filter(
//         (item) => item.localization.length > 1
//       );
//     const ZPsWithRestOfLocalizations = ZPsWithLocalizationsMoreThanOne.map(
//       (item) => {
//         const ordnmb = item.ordnmb;
//         const restOfLocalizations = item.localization.filter(
//           (loc) => loc.planam !== localization.planam
//         );
//         return {
//           ordnmb,
//           restOfLocalizations: restOfLocalizations.map(
//             (locInn) => locInn.planam
//           ),
//         };
//       }
//     );
//     setRestOfLocalizations(ZPsWithRestOfLocalizations);
//     setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP(true);
//     resetValuesToScanNextItem();
//     return;
//   }
// }
// throw new Error(
//   "sendValuesForProtectiveTreatment -> condition not implemented"
// );
// }

// async function sendToServer(dataToBeSend: ProtectiveTreatmentSendDataDTO[]) {
//   if (!dataToBeSend) {
//     toast.warning(ERROR_MESSAGES.LACK_OF_DATA_FOR_PROTECTIVE_TREATMENT);
//     return;
//   }

//   //send data to server
//   let response: ProtectiveTreatmentsResponse;
//   try {
//     setIsLoading(true);

//     response = await query_postDataAsServerAction<
//       ProtectiveTreatmentsResponse,
//       ProtectiveTreatmentSendDataDTO[]
//     >(
//       configPerBuild.apiAddress,
//       "/api.php/REST/custom/treatment",
//       token!,
//       dataToBeSend
//     );

//     //check if response array has the same amount of items as sent items
//     const responseIDsQuantity = response.length;
//     const sentItemsQuantity = dataToBeSend.length;

//     if (responseIDsQuantity === sentItemsQuantity) {
//       toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY);
//     }
//     if (responseIDsQuantity !== sentItemsQuantity) {
//       toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA);
//     }
//   } catch (error) {
//     console.error(error);
//     errorHandler(error as Error);
//   } finally {
//     setIsLoading(false);
//   }
// }
