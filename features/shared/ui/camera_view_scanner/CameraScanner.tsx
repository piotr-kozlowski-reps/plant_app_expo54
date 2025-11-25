import { View, Platform, StyleSheet, Text, DimensionValue } from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView } from "expo-camera";
import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import Scanning from "../scanning/Scanning";
import { useState } from "react";
import Button from "../button/Button";
import { Dimensions } from "react-native";

type Props = {
  scanButtonText: string;
  scanValueHandler: (data: string) => void;
  heightMultiplication?: number;
};

const CameraScanner = (props: Props) => {
  ////vars
  const { scanButtonText, scanValueHandler, heightMultiplication } = props;

  const [qrLock, setQrLock] = useState(true);

  ////tsx
  return (
    <>
      <View
        className="relative w-full"
        style={{
          height: heightMultiplication
            ? Dimensions.get("window").height * heightMultiplication
            : Dimensions.get("window").height * 0.5,
        }}
      >
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
                    title={scanButtonText}
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
    </>
  );
};

export default CameraScanner;
