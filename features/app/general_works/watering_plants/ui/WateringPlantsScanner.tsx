import { View, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  GENERAL_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import Button from "@/features/shared/ui/button/Button";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { useScanValuesForWateringPlants } from "../domain/useScanValuesForWateringPlants";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { router } from "expo-router";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ChooseFieldDetailsModal from "./ChooseFieldDetailsModal";
import { GeneralWork } from "@/features/shared/types/interfaces-general_works";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  wateringPlantsActivity: GeneralWork | undefined;
};

const WateringPlantsScanner = (props: Props) => {
  ////vars
  const { setIsLoading, wateringPlantsActivity } = props;

  //scan values
  const {
    qrLock,
    scannedValue,
    scannedRawValue,
    setQrLock,
    scanValueHandler,
    resetScannedValue,
  } = useScanValuesForWateringPlants(setIsLoading);

  ////tsx
  return (
    <View className="relative w-full h-full">
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              GENERAL_WORKS,
              { actionFn: () => {}, name: "Podlewanie roślin" },
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
                        title={"skanuj lokalizację"}
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
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full">
          <View className="mt-8">
            <Text className="text-center font-nav text-destructive">
              zeskanuj kod lokalizacji
            </Text>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              {/* <ButtonTextAndThreeArrows
                actionFn={() => sendCutConfirmation()}
                text="wyślij potwierdzenie"
                isBackground
                disabled={!scannedValue}
              /> */}
            </View>
            <View className="ml-6">
              <ButtonBack actionFn={() => router.back()} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ModalInternal
        isOpen={!!scannedValue}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ChooseFieldDetailsModal
          closeFn={resetScannedValue}
          setIsLoading={setIsLoading}
          localizaction={scannedValue}
          wateringPlantsActivity={wateringPlantsActivity}
          scannedRawValue={scannedRawValue}
        />
      </ModalInternal>
    </View>
  );
};
export default WateringPlantsScanner;
