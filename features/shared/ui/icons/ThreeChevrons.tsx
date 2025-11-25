import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";
import { darkColor } from "../../constants/colorThemeVars";

type Props = {
  color?: string;
  opacity?: number;
};

const ThreeChevrons = (props: Props) => {
  ////vars
  const { color = darkColor, opacity = 100 } = props;

  ////tsx
  return (
    <View className="pl-[5px] flex-row" style={{ opacity: opacity }}>
      <View className="opacity-20">
        <ChevronRight color={color} strokeWidth={3.7} size={13} />
      </View>
      <View className="-ml-[7px] opacity-50">
        <ChevronRight color={color} strokeWidth={3.7} size={13} />
      </View>
      <View className="-ml-[7px]">
        <ChevronRight color={color} strokeWidth={3.7} size={13} />
      </View>
    </View>
  );
};

export default ThreeChevrons;
