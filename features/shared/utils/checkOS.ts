import { Platform } from "react-native";
import { OS } from "../types/interfaces-phone-info";

export const checkOS = (): OS => {
  if (Platform.OS === "android") return "ANDROID";
  if (Platform.OS === "ios" || (Platform.OS as unknown as string) === "iPadOS")
    return "IOS";

  throw new Error("Phone OS not supported");
};
