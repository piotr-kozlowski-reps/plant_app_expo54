import { View } from "react-native";

const SeparatorHorizontal = () => {
  ////tsx
  return (
    <View className="flex-row items-center justify-center w-full mt-2">
      <View className="w-24 h-[1px] bg-foreground"></View>
    </View>
  );
};

export default SeparatorHorizontal;
