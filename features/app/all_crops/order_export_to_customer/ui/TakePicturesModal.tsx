import {
  darkColor,
  grayColor,
  primaryColor,
} from "@/features/shared/constants/colorThemeVars";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageOff } from "lucide-react-native";
import { View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  closeFn: () => void;
};

const TakePicturesModal = (props: Props) => {
  ////vars
  const { closeFn } = props;

  ////tsx
  return (
    <View className="flex-col items-center justify-between ">
      <View className="relative w-full h-full">
        {Platform.OS === "android" ? <StatusBar hidden /> : null}
        <CameraView facing="back" style={StyleSheet.absoluteFillObject} />

        <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
          <SafeAreaView className="flex-1 w-full">
            <View className="flex-col items-center justify-center w-full h-full">
              <View className="flex-1"></View>
              <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                <View>
                  <ButtonIcon
                    handlePress={() => {}}
                    icon={<ImageOff size={24} color={grayColor} />}
                  />
                </View>
                <View className="flex-1">
                  <ButtonTextAndThreeArrows
                    actionFn={() => {}}
                    text="wyślij"
                    isBackground
                    // disabled={scannedValues.length === 0}
                  />
                </View>
                <View className="ml-6">
                  <ButtonBack actionFn={closeFn} isOutline={false} />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};
export default TakePicturesModal;
