import { View } from "react-native";
import { Image } from "expo-image";
import images from "../../constants/images";

export const Overlay = () => {
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 ">
      <Image
        source={images.camera_overlay}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "stretch",
        }}
      />
    </View>
  );
};
