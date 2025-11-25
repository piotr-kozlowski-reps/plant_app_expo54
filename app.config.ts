export default {
  expo: {
    name: "TraceONtest",
    slug: "traceontest",
    version: "1.2.00",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pl.korsol.traceontest",
    userInterfaceStyle: "automatic",
    plugins: [
      "expo-font",
      // "expo-router",
      "expo-secure-store",
      "expo-audio",
      "expo-asset",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "cover",
          backgroundColor: "#FFFDF9",
        },
      ],
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
      statusBar: {
        backgroundColor: "#FFFDF9",
        barStyle: "dark",
        translucent: true,
        hidden: false,
      },
      softwareKeyboardLayoutMode: "pan", //??
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
