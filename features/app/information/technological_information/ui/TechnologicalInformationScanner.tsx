import {
  INDEX,
  INFORMATION,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";

import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";

import { yellowColor } from "@/features/shared/constants/colorThemeVars";

import { Overlay } from "@/features/shared/ui/overlay/Overlay";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { useScanValuesForTechnologicalInformation } from "../domain/useScanValuesForTechnologicalInformation";
import DetailedTechnologicalInfoModal from "./DetailedTechnologicalInfoModal";

type Props = {
  information_type: "scan_zp" | "search_by_client" | "search_zp";
};

const TechnologicalInformationScanner = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  // const isScanZP = information_type === "scan_zp";
  // const isSearchByClient = information_type === "search_by_client";
  // const isSearchZp = information_type === "search_zp";

  // //modals
  // const [isShowSearchZp, setIsShowSearchZp] = useShowModal(
  //   isSearchZp ? true : false,
  // );
  // const [isShowSearchByClient, setIsShowSearchByClient] = useShowModal(
  //   isSearchByClient ? true : false,
  // );

  // //app path name
  // let appPathName = "";
  // if (isScanZP) appPathName = "Skanuj ZP";
  // if (isSearchByClient) appPathName = "Wyszukaj po kliencie";
  // if (isSearchZp) appPathName = "Wyszukaj ZP";

  // const detailedInfoModalClose = () => {
  //   if (isScanZP) resetValuesToScanNextItem();
  //   if (isSearchZp) {
  //     resetValuesToScanNextItem();
  //     setIsShowSearchZp(true);
  //   }
  //   if (isSearchByClient) {
  //     resetValuesToScanNextItem();
  //     setIsShowSearchByClient(true);
  //   }
  // };

  //modals
  const [isShowSearchZp, setIsShowSearchZp] = useShowModal(false);

  //scan values
  const {
    qrLock,
    isAnyValueScanned,
    // isLocalization,
    // isZP,
    // isTray,
    // isAnyValueScanned,
    // informationData,
    // scannedPureValue,
    setQrLock,
    scanValueHandler,
    // resetValuesToScanNextItem,
    // findInfoAboutSearchedZp,
  } = useScanValuesForTechnologicalInformation(setIsLoading);

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
                { actionFn: () => {}, name: "Informacja technologiczna" },
              ]}
            />
          </View>

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
                          title="skanuj ZP"
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
                zeskanuj kod ZPka
              </Text>
            </View>
            <View className="h-[1px] w-16 bg-foreground mt-4"></View>

            <View className="w-full mt-8">
              <Button
                title="poszukaj ZP po nazwie"
                handlePress={() => setIsShowSearchZp(true)}
                isOutline
              />
            </View>
          </View>

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
          <DetailedTechnologicalInfoModal
          // closeFn={detailedInfoModalClose}
          // informationData={informationData}
          // isLocalization={isLocalization}
          // scannedPureValue={scannedPureValue}
          // isZP={isZP}
          // isTray={isTray}
          />
        </ModalInternal>

        {/* search by zp - modal */}
        {/* <ModalInternal
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
        </ModalInternal> */}

        {/* search by client - modal */}
        {/* <ModalInternal
          isOpen={isShowSearchByClient}
          isTransparent={false}
          backgroundColor={yellowColor}
        >
          <SearchZpByClientModal
            closeFn={() => setIsShowSearchByClient(false)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            findInfoAboutSearchedZp={findInfoAboutSearchedZp}
          />
        </ModalInternal> */}
      </View>
    </>
  );
};
export default TechnologicalInformationScanner;
