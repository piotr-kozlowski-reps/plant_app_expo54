import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useAudioPlayer } from "expo-audio";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";

import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import {
  Param,
  TypeOfScannedValue,
} from "../../../shared/types/interfaces-general";
import { getRepId163 } from "@/features/shared/data-access/getRepId163";
import { configPerBuild } from "@/features/shared/env/env";
import {
  InformationDTO,
  InformationResponse,
} from "@/features/shared/types/interfaces-information";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { audioScanSoundSource } from "@/features/shared/constants/sounds";

export const useScanValuesForInformation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const {
    checkWhatValueWasScanned,
    getPureFieldValue,
    getPureZPValue,
    getPureTrayValue,
  } = useCheckWhatValueIsScannedHelpers();

  //states
  const [scannedPureValue, setScannedPureValue] = useState("");
  const [qrLock, setQrLock] = useState(true);
  const [informationData, setInformationData] = useState<InformationDTO[]>([]);
  const [isLocalization, setIsLocalization] = useState(false);
  const [isZP, setIsZP] = useState(false);
  const [isTray, setIsTray] = useState(false);
  const [isAnyValueScanned, setIsAnyValueScanned] = useState(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    try {
      setIsLoading(true);
      const whatHasBeenScanned = checkWhatValueWasScanned(scannedValue);

      if (whatHasBeenScanned !== "unknown")
        await fetchData(scannedValue, whatHasBeenScanned);
      if (whatHasBeenScanned === "unknown")
        scannedUnknownValueHandler(scannedValue);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetValuesToScanNextItem = () => {
    // setScannedPureValue("");
    // setInformationData([]);
    setIsLocalization(false);
    setIsZP(false);
    setIsTray(false);
  };

  //side effects
  useEffect(() => {
    if (isLocalization || isZP || isTray) setIsAnyValueScanned(true);
    else setIsAnyValueScanned(false);
  }, [isLocalization, isZP, isTray]);

  //hook return
  return {
    qrLock,
    isLocalization,
    isZP,
    isTray,
    isAnyValueScanned,
    informationData,
    scannedPureValue,
    setQrLock,
    scanValueHandler,
    resetValuesToScanNextItem,
  };

  //helpers
  async function fetchData(
    scannedValue: string,
    whatHasBeenScanned: TypeOfScannedValue
  ) {
    if (whatHasBeenScanned === "unknown") {
      scannedUnknownValueHandler(scannedValue);
      return;
    }

    let param: Param = getDesiredParams(scannedValue, whatHasBeenScanned);

    const response: InformationResponse = await getRepId163(
      configPerBuild.apiAddress,
      token!,
      param
    );

    if (
      response.data.resultMainQuery === -1 ||
      response.data.resultMainQuery.length === 0
    ) {
      toast.error(getDesiredErrorMessage(whatHasBeenScanned, param.value));
      return;
    }

    const informationDataFetched = response.data.resultMainQuery;
    setScannedPureValue(param.value);
    setAppropriateDataHandler(whatHasBeenScanned, informationDataFetched);
  }

  function setAppropriateDataHandler(
    whatHasBeenScanned: TypeOfScannedValue,
    informationData: InformationDTO[]
  ): void {
    // resetValuesToScanNextItem();

    setIsLocalization(false);
    setIsZP(false);
    setIsTray(false);

    if (whatHasBeenScanned === "field") {
      setIsLocalization(true);
      setInformationData(informationData);
      return;
    }

    if (whatHasBeenScanned === "zp_gru" || whatHasBeenScanned === "zp_roz") {
      setIsZP(true);
      setInformationData(informationData);
      return;
    }
    if (whatHasBeenScanned === "tray") {
      setIsTray(true);
      setInformationData(informationData);
      return;
    }

    throw new Error(
      "setAppropriateDataHandler - whatHasBeenScanned not implemented."
    );
  }

  function scannedUnknownValueHandler(scannedValue: string) {
    toast.warning(`Zeskanowany kod QR (${scannedValue}) jest niepoprawny.`);
  }

  function getDesiredParams(
    scannedValue: string,
    whatHasBeenScanned: TypeOfScannedValue
  ): Param {
    if (whatHasBeenScanned === "field") {
      return {
        name: "planam",
        value: getPureFieldValue(scannedValue),
      };
    }
    if (whatHasBeenScanned === "zp_gru" || whatHasBeenScanned === "zp_roz") {
      return {
        name: "ordnmb",
        value: getPureZPValue(scannedValue),
      };
    }
    if (whatHasBeenScanned === "tray") {
      return {
        name: "stk_id",
        value: getPureTrayValue(scannedValue),
      };
    }

    throw new Error("getDesiredParams - whatHasBeenScanned not implemented.");
  }

  function getDesiredErrorMessage(
    whatHasBeenScanned: TypeOfScannedValue,
    pureValue: string
  ) {
    if (whatHasBeenScanned === "field") {
      return `Lokalizacja (${pureValue}) nie została odnaleziona w systemie.`;
    }

    throw new Error(
      "getDesiredErrorMessage - whatHasBeenScanned not implemented."
    );
  }
};
