import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import { View, Text } from "react-native";
import { ZPShortenedInfoWithPics } from "../../types/interfaces-zp";
import Button from "./Button";
import Scanning from "../scanning/Scanning";
import { TrayInfoWithPics } from "../../types/interfaces-destroy_tray";

type Props = {
  qrLock: boolean;
  scannedValue: ZPShortenedInfoWithPics | TrayInfoWithPics | null;
  setQrLock: (value: React.SetStateAction<boolean>) => void;
  isTakingPicturesAvailable: boolean;
  takePictureHandler: () => Promise<void>;
  buttonTextForQrCodeScan: string;
};

const ButtonOnCameraViewForQrAndPictures = (props: Props) => {
  ////tsx
  const {
    qrLock,
    scannedValue,
    isTakingPicturesAvailable,
    buttonTextForQrCodeScan,
    setQrLock,
    takePictureHandler,
  } = props;

  return (
    <>
      {!scannedValue ? (
        <>
          <Overlay />

          <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
            {qrLock ? (
              <View className="flex-col items-center justify-center w-full h-full">
                <View className="w-full px-16">
                  <View className="opacity-70">
                    <Button
                      title={buttonTextForQrCodeScan}
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
        </>
      ) : null}

      {scannedValue && isTakingPicturesAvailable ? (
        <>
          <Overlay />
          <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
            <View className="flex-col items-center justify-center w-full h-full">
              <View className="w-full px-16">
                <View className="opacity-70">
                  <Button
                    title={"zrób zdjęcie"}
                    handlePress={() => takePictureHandler()}
                    containerStyles={`h-32`}
                    height={128}
                  />
                </View>
              </View>
            </View>
          </View>
        </>
      ) : null}

      {scannedValue && !isTakingPicturesAvailable ? (
        <>
          <Overlay />

          <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full opacity-80 bg-yellow"></View>
          <View className="absolute top-0 bottom-0 left-0 right-0 flex-col items-center justify-center w-full h-full px-16">
            <Text className="text-foreground font-default-bold">
              Zrobiono już maksymalną ilość zdjęć.
            </Text>
            <Text className="text-center text-foreground font-default-normal">
              Brak możliwości zrobienia zdjęć następnych.
            </Text>
          </View>
        </>
      ) : null}
    </>
  );
};
export default ButtonOnCameraViewForQrAndPictures;
