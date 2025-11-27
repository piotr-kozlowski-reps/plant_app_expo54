import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";
import { PortalProvider } from "@gorhom/portal";
import { View, Text } from "react-native";
import { configPerBuild } from "@/features/shared/env/env";
import { useTestOrProductionStore } from "@/features/shared/stores/useTestOrProductionStore";
import { useDateOfLastLoginSecureStoreHandler } from "@/features/shared/utils/useDateOfLastLoginSecureStoreHandler";
import { ThemeProvider } from "@/features/shared/providers/ThemeProvider";

import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//query QueryClient
const client = new QueryClient();

export default function RootLayout() {
  ////fonts
  const [fontsLoaded, error] = useFonts({
    EuclidCircularBLight: require("../assets/fonts/EuclidCircularBLight.ttf"),
    EuclidCircularBLightItalic: require("../assets/fonts/EuclidCircularBLightItalic.ttf"),
    EuclidCircularBRegular: require("../assets/fonts/EuclidCircularBRegular.ttf"),
    EuclidCircularBMedium: require("../assets/fonts/EuclidCircularBMedium.ttf"),
    EuclidCircularBMediumItalic: require("../assets/fonts/EuclidCircularBMediumItalic.ttf"),
    EuclidCircularBSemiBold: require("../assets/fonts/EuclidCircularBSemiBold.ttf"),
    EuclidCircularBSemiBoldItalic: require("../assets/fonts/EuclidCircularBSemiBoldItalic.ttf"),
    EuclidCircularBBold: require("../assets/fonts/EuclidCircularBBold.ttf"),
    EuclidCircularBBoldItalic: require("../assets/fonts/EuclidCircularBBoldItalic.ttf"),
  });
  const { isProduction } = useTestOrProductionStore();
  useDateOfLastLoginSecureStoreHandler();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PortalProvider>
          <QueryClientProvider client={client}>
            <KeyboardProvider>
              <StatusBar style="dark" translucent={true} hidden={false} />

              <Stack>
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{ headerShown: false, animation: "slide_from_left" }}
                />
                <Stack.Screen
                  name="app-not-up-to-date"
                  options={{ headerShown: false, animation: "slide_from_left" }}
                />

                {/* //app */}
                <Stack.Screen
                  name="app/information/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="app/field_crops/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="app/greenhouse_crops/index"
                  options={{ headerShown: false }}
                />
              </Stack>

              {isProduction ? null : (
                <View className="w-full h-[16px] bg-emerald-400">
                  <Text className="text-center text-foreground font-default-normal">
                    Środowisko testowe:{" "}
                    <Text className="text-foreground font-default-semibold">{`${configPerBuild.apiAddress}`}</Text>
                  </Text>
                </View>
              )}

              <Toaster position="top-center" />
            </KeyboardProvider>
          </QueryClientProvider>
        </PortalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
