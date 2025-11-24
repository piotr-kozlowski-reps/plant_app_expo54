import { TouchableOpacity, View } from "react-native";

type Props = {
  actionFn: () => void;
  icon: React.ReactNode;
  size?: number;
  paddingY?: number;
  paddingX?: number;
};

const ButtonIconWithCustomSize = (props: Props) => {
  ////vars
  const { actionFn, icon, size = 48, paddingX = 12, paddingY = 12 } = props;

  ////tsx
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={actionFn}
      style={{
        width: size,
        height: size,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <View
        style={{
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
          width: size,
          height: size,
        }}
      >
        <View className="w-full h-full ">{icon}</View>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonIconWithCustomSize;
