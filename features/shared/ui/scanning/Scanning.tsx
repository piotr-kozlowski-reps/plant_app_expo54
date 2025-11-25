import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const duration = 800;

const Scanning = () => {
  ////vars
  const opacity = useSharedValue(0);
  const animatedDefault = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration,
      }),
      -1,
      true
    );
  }, []);

  ////tsx
  return (
    <Animated.View style={animatedDefault}>
      <Text className="text-background-nuance font-default-bold">
        skanuję ...
      </Text>
    </Animated.View>
  );
};

export default Scanning;
