import { Dimensions, Platform, StyleSheet } from "react-native";
import { View } from "react-native";
import { Image } from "expo-image";
import images from "@/features/shared/constants/images";

// const { width, height } = Dimensions.get("window");
// const widthView = width * 0.94;
// const heightView = height * 0.6;

// const innerDimension = 300;

// const outer = rrect(rect(0, 0, widthView, heightView), 0, 0);
// const inner = rrect(
//   rect(
//     widthView / 2 - innerDimension / 2,
//     heightView / 2 - innerDimension / 2,
//     innerDimension,
//     innerDimension / 1.4
//   ),
//   50,
//   50
// );

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

// <Canvas
//   style={
//     Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
//   }
// >
//   <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
// </Canvas>
