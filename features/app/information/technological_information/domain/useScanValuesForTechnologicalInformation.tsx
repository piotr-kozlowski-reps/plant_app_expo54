import { audioScanSoundSource } from "@/features/shared/constants/sounds";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { useGuard_CheckDataToBeScanned } from "@/features/shared/utils/useGuard_CheckDataToBeScanned";
import { useCheckWhatValueIsScannedHelpers } from "@/features/shared/utils/useCheckWhatValueIsScannedHelpers";
import { configPerBuild } from "@/features/shared/env/env";
import { getRepId1695 } from "@/features/shared/data-access/getRepId1695";
import { TechnicalInformation } from "@/features/shared/types/interfaces-information";

export const useScanValuesForTechnologicalInformation = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  ////vars
  const player = useAudioPlayer(audioScanSoundSource);
  const { token } = useAuthSessionStore();
  const { errorHandler } = useErrorHandler();
  const { getPureZPValue } = useCheckWhatValueIsScannedHelpers();

  //states
  const [qrLock, setQrLock] = useState(true);
  const [informationData, setInformationData] = useState<
    TechnicalInformation[]
  >([]);

  //modals
  // const [isShowConfirmActivityModal, setIsShowConfirmActivityModal] =
  //   useShowModal();
  // const [isShowQuantityModal, setShowQuantityModal] = useShowModal(false);

  //fn
  const scanValueHandler = async (scannedValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    player.seekTo(0);
    player.play();

    //check allowed scanned values
    const { isScannedDataCorrect } = useGuard_CheckDataToBeScanned(
      scannedValue,
      ["zp_roz", "zp_gru"],
    );
    if (!isScannedDataCorrect) return;

    try {
      setIsLoading(true);

      await fetchData(scannedValue);
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  //derived data
  const isAnyValueScanned =
    informationData && informationData.length ? true : false;

  //hook return
  return {
    qrLock,
    isAnyValueScanned,

    setQrLock,
    scanValueHandler,
  };

  //helpers
  async function fetchData(scannedZPValue: string) {
    const zpValue = getPureZPValue(scannedZPValue);

    const response: TechnicalInformation[] = await getRepId1695(
      configPerBuild.apiAddress,
      token!,
      zpValue,
    );

    setInformationData(response);
  }
};
