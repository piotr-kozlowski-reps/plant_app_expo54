import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { Localization } from "@/features/shared/types/interfaces-localization";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import {
  InternalTransportMovements,
  InternalTransportMovementsResponse,
  ZPCombinedInfo,
  ZPLocalizationInfoPlusQuantityToBeMoved,
} from "@/features/shared/types/interfaces-zp";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { useGetZPInfo_Report113 } from "@/features/shared/data-access/useGetZPInfo_Report113";
import { AllInternalTransportSubmodules } from "@/features/shared/types/interfaces-auth";
import { TypeOfScannedValue } from "@/features/shared/types/interfaces-general";
import { useGetLocalizationInfo_Report1580 } from "@/features/shared/data-access/useGetLocalizationInfo_Report1580";
import { useCheckIfZpIsAlreadyScanned } from "@/features/shared/utils/useCheckIfZPIsAlreadyScanned";
import { getRepId116 } from "@/features/shared/data-access/getRepId116";

export const useScanValuesForInternalTransport = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  submoduleType: AllInternalTransportSubmodules,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { checkWhatValueWasScanned, getPureFieldValue } =
    useCheckWhatValueIsScannedHelpers();
  const { getZPInfo_Rep113 } = useGetZPInfo_Report113();
  const { getLocalizationInfoInfo_Report1580 } =
    useGetLocalizationInfo_Report1580();
  const { checkIfZpIsAlreadyScanned } = useCheckIfZpIsAlreadyScanned();

  //states
  const [localization, setLocalization] = useState<Localization | null>(null);
  const [zpCombinedInfo, setZpCombinedInfo] = useState<ZPCombinedInfo | null>(
    null,
  );
  const [overallZPsWithQuantities, setOverallZPsWithQuantities] = useState<
    ZPCombinedInfo[]
  >([]);
  const [qrLock, setQrLock] = useState(true);
  const [isFieldScanned, setIsFieldScanned] = useState(false);
  const [isShowModalWithZPDetails, setIIsShowModalWithZPDetails] =
    useState(false);

  //fn
  /**
   * @public
   * @topic
   * @order 20
   * REALIZACJA:
   */
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    setIsLoading(true);

    try {
      if (!isFieldScanned) {
        /**
         * @public
         * @procedureItem
         * @order
         * skan QR lokalizacji:
         */

        await scanField(scannedValue);
      }
      if (isFieldScanned) {
        /**
         * @public
         * @procedureItem
         * @order 40
         * skan ZP:
         */
        await scanZP(scannedValue, submoduleType);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const changeQuantityHandler = (
    localizationWithNewQuantity: ZPLocalizationInfoPlusQuantityToBeMoved,
  ) => {
    if (!zpCombinedInfo) {
      errorHandler(
        new Error(
          "useScanValuesForInternalTransport -> changeQuantityHandler -> no localization to update.",
        ),
      );
      return;
    }

    const foundLocalization = zpCombinedInfo.localization.find((loc) => {
      return loc.id____ === localizationWithNewQuantity.id____;
    });

    if (!foundLocalization) {
      errorHandler(
        new Error(
          "useScanValuesForInternalTransport -> changeQuantityHandler -> Localization not found.",
        ),
      );
      return;
    }

    const currentLocalizations = zpCombinedInfo.localization;
    for (let loc of currentLocalizations) {
      if (loc.id____ === localizationWithNewQuantity.id____) {
        loc.quantity_to_be_moved =
          localizationWithNewQuantity.quantity_to_be_moved;
      }
    }
    const newZpCombinedInfo = {
      ...zpCombinedInfo,
      localization: currentLocalizations,
    };

    setZpCombinedInfo(newZpCombinedInfo);
  };

  const changeOverallZPsWithQuantities = () => {
    const currentZPWithQuantities = zpCombinedInfo;

    if (!currentZPWithQuantities) {
      errorHandler(
        new Error(
          "useScanValuesForInternalTransport -> changeOverallZPsWithQuantities -> no zpCombinedInfo",
        ),
      );
      return;
    }

    if (!overallZPsWithQuantities.length) {
      setOverallZPsWithQuantities([zpCombinedInfo]);
    }

    if (overallZPsWithQuantities.length > 0) {
      const overallZPsWithQuantitiesLocal = [...overallZPsWithQuantities];

      //check if ZP that is to be added already exists in the list
      const foundZP = overallZPsWithQuantitiesLocal.find(
        (item) => item.ordnmb === currentZPWithQuantities.ordnmb,
      );

      if (!foundZP) {
        overallZPsWithQuantitiesLocal.push(currentZPWithQuantities);
        setOverallZPsWithQuantities(overallZPsWithQuantitiesLocal);
      }

      if (foundZP) {
        for (let item of overallZPsWithQuantitiesLocal) {
          if (item.ordnmb === currentZPWithQuantities.ordnmb) {
            item.localization = currentZPWithQuantities.localization;
          }
        }

        setOverallZPsWithQuantities(overallZPsWithQuantitiesLocal);
      }
    }

    const successMessage = `Dodano do listy ${currentZPWithQuantities.ordnmb} (wraz z informacją o zabieranych ilościach).`;
    toast.success(successMessage, { id: successMessage });
  };

  const clearChosenZPCombinedInfo = () => {
    setZpCombinedInfo(null);
  };

  ////send values to server
  const sendValuesForInternalTransport = async () => {
    if (
      !localization ||
      !overallZPsWithQuantities ||
      !overallZPsWithQuantities.length
    ) {
      throw new Error(
        "useScanValuesForInternalTransport -> sendValuesForInternalTransport -> no localization or overallZPsWithQuantities",
      );
    }
    /**
     * @public
     * @transformApiItem
     * @order 110
     * wysyłka - custom api - POST:
     * adres: <b>{{URL}}</b>/api.php/REST/custom/<b>movements</b>
     * @separator
     * <b>dane</b>:
     * [
     *     {
     *           sordid: number;
     *           ordnmb: string;
     *          movfrm: number;
     *          mov_to: number;
     *          movqty: number;
     *          scanned_raw_value: string;
     *     }
     * ]
     */
    const valuesToBeSent: InternalTransportMovements[] = [];
    overallZPsWithQuantities.forEach((zp) => {
      zp.localization.forEach((loc) => {
        const internalTransportItemDTO: InternalTransportMovements = {
          sordid: zp.ordid_,
          ordnmb: zp.ordnmb,
          movfrm: loc.id____,
          mov_to: localization.id____,
          movqty: loc.quantity_to_be_moved,
          scanned_raw_value: zp.scannedRawValue,
        };
        valuesToBeSent.push(internalTransportItemDTO);
      });
    });

    const valuesToBeSentFilteredToOnlyMovedItems = valuesToBeSent.filter(
      (loc) => loc.movqty > 0,
    );
    if (valuesToBeSentFilteredToOnlyMovedItems.length === 0) {
      toast.warning(ERROR_MESSAGES.QUANTITY_TO_BE_SENT_WAS_ZERO, {
        id: ERROR_MESSAGES.QUANTITY_TO_BE_SENT_WAS_ZERO,
      });
      return;
    }

    //send data to server
    let response: InternalTransportMovementsResponse;
    try {
      setIsLoading(true);

      response = await query_postDataAsServerAction<
        InternalTransportMovementsResponse,
        InternalTransportMovements[]
      >(
        configPerBuild.apiAddress,
        "/api.php/REST/custom/movements",
        token!,
        valuesToBeSentFilteredToOnlyMovedItems,
      );

      //check if response array has the same amount of items as sent items
      const responseIDsQuantity = response.length;
      const sentItemsQuantity = valuesToBeSentFilteredToOnlyMovedItems.length;

      if (responseIDsQuantity === sentItemsQuantity) {
        toast.success(MESSAGES.DATA_SENT_SUCCESSFULLY, {
          id: MESSAGES.DATA_SENT_SUCCESSFULLY,
        });
        resetWholeState();
      }
      if (responseIDsQuantity !== sentItemsQuantity) {
        toast.warning(ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA, {
          id: ERROR_MESSAGES.PROBLEM_WHEN_SENDING_DATA,
        });
      }
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  //hook return
  return {
    localization,
    qrLock,
    isFieldScanned,
    ZPsWithQuantities: overallZPsWithQuantities,
    isShowModalWithZPDetails,
    zpCombinedInfo,
    scanValueHandler,
    setQrLock,
    setIIsShowModalWithZPDetails,
    changeQuantityHandler,
    changeOverallZPsWithQuantities,
    clearChosenZPCombinedInfo,
    sendValuesForInternalTransport,
    setZpCombinedInfo,
  };

  //helpers
  function resetWholeState() {
    setLocalization(null);
    setZpCombinedInfo(null);
    setOverallZPsWithQuantities([]);
    setIsFieldScanned(false);
  }
  async function scanField(scannedValue: string) {
    if (checkWhatValueWasScanned(scannedValue) !== "field") {
      const warningMessage = `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. Lokalizacja musi mieć format: POLE_<numer>`;
      toast.warning(warningMessage, { id: warningMessage });
      return;
    }
    /**
     * @public
     * @procedureItem
     * @order 30
     * raporty:
     * @readFile `features/shared/data-access/useGetLocalizationInfo_Report1580.tsx`
     */
    const fieldName = getPureFieldValue(scannedValue);
    const localizationInfo = await getLocalizationInfoInfo_Report1580(
      token!,
      fieldName,
      errorHandler,
    );

    if (!localizationInfo) return;
    setLocalization(localizationInfo);
    setIsFieldScanned(true);
  }
  async function scanZP(
    scannedValue: string,
    submoduleType: AllInternalTransportSubmodules,
  ) {
    if (
      checkWhatValueWasScanned(scannedValue) === "field" ||
      checkWhatValueWasScanned(scannedValue) === "tray" ||
      checkWhatValueWasScanned(scannedValue) === "unknown"
    ) {
      const warningMessage = `Zeskanowa wartość: "${scannedValue}" jest niepoprawna.`;
      toast.warning(warningMessage, { id: warningMessage });
      return;
    }

    const desiredTypOfScannedValue: TypeOfScannedValue =
      getDesiredTypOfScannedValue(submoduleType);

    /**
     * @public
     * @guard
     * @order 45
     * weryfikacja typu zeskanowanej wartości i czy dane zlecenie jest GRU / ROZ lub DON dla odpowiedniego modułu w jakim jesteśmy.
     * Jeżeli typ zeskanowanej wartości jest inny -> info + koniec procedury.
     */
    if (checkWhatValueWasScanned(scannedValue) !== desiredTypOfScannedValue) {
      const toastMessage = getToastMessageBasedOnDesiredTypOfScannedValue(
        desiredTypOfScannedValue,
        scannedValue,
      );

      toast.warning(toastMessage, { id: toastMessage });
      return;
    }

    const ZPWithoutAdditional_ZLEC_ = scannedValue.replace("ZLEC_", "");

    //check if ZP is already scanned
    if (
      checkIfZpIsAlreadyScanned(
        ZPWithoutAdditional_ZLEC_,
        overallZPsWithQuantities,
      )
    ) {
      toast.warning(ERROR_MESSAGES.VALUE_ALREADY_SCANNED, {
        id: ERROR_MESSAGES.VALUE_ALREADY_SCANNED,
      });
      return;
    }

    /////////
    //fetch all desired info
    /**
     * @public
     * @procedureItem
     * @order 50
     * raporty:
     * @readFile `features/shared/data-access/useGetZPInfo_Report113.tsx`
     */
    const ZPInfoPromise = getZPInfo_Rep113(
      token!,
      ZPWithoutAdditional_ZLEC_,
      errorHandler,
    );
    /**
     * @public
     * @procedureItem
     * raporty:
     * @readFile `features/shared/data-access/getRepId116.ts`
     */
    const ZPLocalizationInfoPromise = getZpLocalizationInfo(
      token!,
      ZPWithoutAdditional_ZLEC_,
      errorHandler,
      desiredTypOfScannedValue === "zp_roz" ? true : false,
    );
    const [ZPInfo, ZPLocalizationInfo] = await Promise.all([
      ZPInfoPromise,
      ZPLocalizationInfoPromise,
    ]);

    if (!ZPInfo || !ZPLocalizationInfo) {
      return;
    }

    const zpCombinedInfo: ZPCombinedInfo = {
      ...ZPInfo,
      localization: ZPLocalizationInfo,
      scannedRawValue: scannedValue,
    };

    setZpCombinedInfo(zpCombinedInfo);
    setIIsShowModalWithZPDetails(true);
  }
};

async function getZpLocalizationInfo(
  token: string,
  ZPWithoutAdditional_ZLEC: string,
  errorHandler: (error: Error, errorTitle?: string) => void,
  isRoz?: boolean,
): Promise<ZPLocalizationInfoPlusQuantityToBeMoved[] | null> {
  let response: ZPLocalizationInfoPlusQuantityToBeMoved[] | null;

  try {
    response = await getRepId116(token, ZPWithoutAdditional_ZLEC, isRoz);

    return response;
  } catch (error) {
    errorHandler(error as Error);
  }

  return null;
}

function getDesiredTypOfScannedValue(
  submoduleType: AllInternalTransportSubmodules,
): TypeOfScannedValue {
  switch (submoduleType) {
    case "field_crops_works_internal_transport":
      return "zp_gru";

    case "greenhouse_crops_works_internal_transport":
      return "zp_roz";

    case "potted_plants_works_internal_transport":
      return "zp_don";

    default:
      throw new Error("getDesiredTypOfScannedValue -> Unknown submodule type");
  }
}

function getToastMessageBasedOnDesiredTypOfScannedValue(
  desiredTypOfScannedValue: TypeOfScannedValue,
  scannedValue: string,
) {
  switch (desiredTypOfScannedValue) {
    case "zp_gru":
      return `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. Zeskanowałeś ZP rozsady szklarniowej lub roślinę doniczkową, a dopuszczalny jest tylko ZP rozsady gruntowej.`;

    case "zp_roz":
      return `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. Zeskanowałeś ZP rozsady gruntowej lub roślinę doniczkową, a dopuszczalny jest tylko ZP rozsady szklarniowej.`;

    case "zp_don":
      return `Zeskanowa wartość: "${scannedValue}" jest niepoprawna. Zeskanowałeś ZP rozsady gruntowej lub rozsady szklarniowej, a dopuszczalny jest tylko ZP rośliny doniczkowej.`;

    default:
      throw new Error(
        "getToastMessageBasedOnDesiredTypOfScannedValue -> Unknown desiredTypOfScannedValue",
      );
  }
}
