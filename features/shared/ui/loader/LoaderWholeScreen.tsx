import { ActivityIndicator, View } from "react-native";
import { darkColor } from "../../constants/colorThemeVars";

const LoaderWholeScreen: React.FC = () => {
  ////tsx
  return (
    <>
      <View className="absolute top-0 left-0 z-50 w-full h-full opacity-50 bg-background"></View>

      <View className="absolute top-0 left-0 z-50 items-center justify-center w-full h-full">
        <ActivityIndicator color={darkColor} size="large" />
      </View>
    </>
  );
};

export default LoaderWholeScreen;
