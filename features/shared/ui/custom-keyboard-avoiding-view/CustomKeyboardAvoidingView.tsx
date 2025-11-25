import { memo, useCallback, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const CustomKeyboardAvoidingView = memo(function ({
  children,
  ...rest
}: KeyboardAvoidingViewProps) {
  const platform = Platform.OS;

  const paddingBottom = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      paddingBottom: paddingBottom.value,
    };
  });
  const animation = useCallback((value: number) => {
    "worklet";
    if (paddingBottom.value < value || !value) {
      paddingBottom.value = withSpring(value, { damping: 50 });
    }
  }, []);

  useEffect(() => {
    const setKeyboardIOS = (height: number) => {
      animation(height);
    };

    const willShow = Keyboard.addListener("keyboardWillShow", (e) =>
      setKeyboardIOS(e.endCoordinates.height)
    );
    const willHide = Keyboard.addListener("keyboardWillHide", () =>
      setKeyboardIOS(0)
    );

    return () => {
      willShow.remove();
      willHide.remove();
    };
  }, []);

  if (platform === "android") {
    return (
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }} {...rest}>
        {children}
      </KeyboardAvoidingView>
    );
  }

  if (platform === "ios") {
    return (
      <Animated.View
        style={[
          style,
          {
            flex: 1,
          },
        ]}
        {...rest}
      >
        {children}
      </Animated.View>
    );
  }

  return <View>{children}</View>;
});

CustomKeyboardAvoidingView.displayName = "CustomKeyboardAvoidingView";

export { CustomKeyboardAvoidingView };
