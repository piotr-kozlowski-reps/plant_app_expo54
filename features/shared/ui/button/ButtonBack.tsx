import { TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";
import { darkColor } from "../../constants/colorThemeVars";
import clsx from "clsx";
import ThreeChevrons from "../icons/ThreeChevrons";

type Props = {
  actionFn?: () => void;
  isOutline?: boolean;
};

const ButtonBack = (props: Props) => {
  ////vars
  const { actionFn, isOutline = true } = props;

  ////tsx
  return (
    <View className="flex items-end justify-end ">
      <View className="flex-1 w-full"></View>
      <TouchableOpacity
        className={clsx(
          "flex-row items-center justify-end bg-background-nuance  h-[48px] rounded-l-app pl-6 pr-4",
          isOutline ? "border-l-2 border-t-2 border-b-2 border-primary" : ""
        )}
        onPress={actionFn ? () => actionFn() : () => router.back()}
      >
        <View>
          <Text className="text-foreground font-default-bold">powrót</Text>
        </View>
        <View>
          <ThreeChevrons color={darkColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonBack;
