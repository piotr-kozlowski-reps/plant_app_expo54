import {
  INDEX,
  INFORMATION,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForInformation } from "../scan_zp/domain/useScanValuesForInformation";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";

import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";

import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import DetailedInfoModal from "./DetailedInfoModal";
import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import SearchZpByNameModal from "../search_zp/ui/SearchZpByNameModal";
import SearchZpByClientModal from "../search_by_client/ui/SearchZpByClientModal";
import { ZpInProduction } from "@/features/shared/types/interfaces-zps_in_production";

type Props = {
  information_type: "scan_zp" | "search_by_client" | "search_zp";
};

const InformationScanner = (props: Props) => {
  ////vars
  const { information_type } = props;
  const [isLoading, setIsLoading] = useState(false);
  const isScanZP = information_type === "scan_zp";
  const isSearchByClient = information_type === "search_by_client";
  const isSearchZp = information_type === "search_zp";

  //modals
  const [isShowSearchZp, setIsShowSearchZp] = useShowModal(
    isSearchZp ? true : false,
  );
  const [isShowSearchByClient, setIsShowSearchByClient] = useShowModal(
    isSearchByClient ? true : false,
  );

  //app path name
  let appPathName = "";
  if (isScanZP) appPathName = "Skanuj ZP";
  if (isSearchByClient) appPathName = "Wyszukaj po kliencie";
  if (isSearchZp) appPathName = "Wyszukaj ZP";

  const detailedInfoModalClose = () => {
    if (isScanZP) resetValuesToScanNextItem();
    if (isSearchZp) {
      resetValuesToScanNextItem();
      setIsShowSearchZp(true);
    }
    if (isSearchByClient) {
      resetValuesToScanNextItem();
      setIsShowSearchByClient(true);
    }
  };

  //scan values
  const {
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
    findInfoAboutSearchedZp,
  } = useScanValuesForInformation(setIsLoading);

  /** clients */
  const [chosenClient, setChosenClient] = useState<ZpInProduction | null>(null);

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-8">
            <AppPath
              paths={[
                INDEX,
                INFORMATION,
                { actionFn: () => {}, name: appPathName },
              ]}
            />
          </View>

          {isScanZP ? (
            <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
              <View className="h-[50vh] w-full relative">
                {Platform.OS === "android" ? <StatusBar hidden /> : null}
                <CameraView
                  facing="back"
                  style={StyleSheet.absoluteFillObject}
                  onBarcodeScanned={({ data }) => {
                    if (data && !qrLock) {
                      scanValueHandler(data);
                      setQrLock(true);
                    }
                  }}
                />

                <Overlay />

                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title="skanuj lokalizację, ZP lub tacę"
                            handlePress={() => {
                              setQrLock(false);
                            }}
                            containerStyles={`h-32`}
                            isGrayed={!qrLock}
                            height={128}
                          />
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {!qrLock ? (
                    <View className="flex-col items-center justify-end w-full h-full pb-6">
                      <Scanning />
                    </View>
                  ) : null}
                </View>
              </View>
              <View className="mt-4">
                <Text className="text-center font-nav text-destructive">
                  zeskanuj kod lokalizacji,
                </Text>
                <Text className="text-center font-nav text-destructive">
                  ZP&apos;ka lub tacy
                </Text>
              </View>
            </View>
          ) : null}

          {isSearchZp || isSearchByClient ? (
            <View className="mt-16">
              <Text className="text-center font-nav text-destructive">
                processing...
              </Text>
            </View>
          ) : null}

          <View className="flex-1"></View>

          <View className="w-full mb-6">
            <ButtonBack isOutline={false} />
          </View>
        </SafeAreaView>

        {/* details -  modal */}
        <ModalInternal
          isOpen={isAnyValueScanned}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <DetailedInfoModal
            closeFn={detailedInfoModalClose}
            informationData={informationData}
            isLocalization={isLocalization}
            scannedPureValue={scannedPureValue}
            isZP={isZP}
            isTray={isTray}
          />
        </ModalInternal>

        {/* search by zp - modal */}
        <ModalInternal
          isOpen={isShowSearchZp}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <SearchZpByNameModal
            closeFn={() => setIsShowSearchZp(false)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            findInfoAboutSearchedZp={findInfoAboutSearchedZp}
          />
        </ModalInternal>

        {/* search by client - modal */}
        <ModalInternal
          isOpen={isShowSearchByClient}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <SearchZpByClientModal
            closeFn={() => setIsShowSearchByClient(false)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            findInfoAboutSearchedZp={findInfoAboutSearchedZp}
            chosenClient={chosenClient}
            setChosenClient={setChosenClient}
          />
        </ModalInternal>
      </View>
    </>
  );
};
export default InformationScanner;
