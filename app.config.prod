export default {
  expo: {
    name: "TraceON",
    slug: "traceon",
    version: "1.2.03",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pl.korsol.traceon",
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
      bundleIdentifier: "pl.korsol.traceon",
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
      package: "pl.korsol.traceon",
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
        projectId: "b04b5b1f-e159-457a-8a84-ba5d7f0eccd8",
      },
    },
  },
};
