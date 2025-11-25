import "expo-file-system";

declare module "*.css";

declare module "expo-file-system" {
  // keep the existing exports
  export * from "expo-file-system";

  // add the missing constant
  export const cacheDirectory: string | null;
}
