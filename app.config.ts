export default {
  expo: {
    name: "TraceONtest",
    slug: "traceontest",
    version: "1.2.00",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pl.korsol.traceontest",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    plugins: [
      "expo-router",
      [
        "expo-audio",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "cover",
          backgroundColor: "#FFFDF9",
        },
      ],
      "expo-font",
      "expo-secure-store",
      "expo-asset",
    ],
    splash: {
      backgroundColor: "#FFFDF9",
      image: "./assets/images/splash.png",
      resizeMode: "cover",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "pl.korsol.traceontest",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["audio"],
        NSCameraUsageDescription:
          "Ta aplikacja wykorzystuje aparat, aby umożliwić Ci robienie zdjęć kodów QR i roślin.",
        NSMicrophoneUsageDescription:
          "Ta aplikacja wykorzystuje mikrofon do nagrywania audio.",
        NSPhotoLibraryUsageDescription:
          "Ta aplikacja potrzebuje dostępu do Twojej biblioteki zdjęć, aby zapisywać i udostępniać obrazy.",
      },
    },
    android: {
      package: "pl.korsol.traceontest",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFDF9",
      },

      softwareKeyboardLayoutMode: "pan", //??
    },
    statusBar: {
      backgroundColor: "#FFFDF9",
      barStyle: "dark",
      translucent: true,
      hidden: false,
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "60a19f78-ceb2-494c-82c3-b807ab4c814f",
      },
    },
  },
};
