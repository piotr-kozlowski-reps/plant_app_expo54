export const OS = {
  IOS: "IOS",
  ANDROID: "ANDROID",
} as const;
export type OS = keyof typeof OS;

export type PhoneInfo = {
  phone_model: string | null;
  os: OS;
  os_version: string | null;
  app_version: string | null;
  app_build: string | null;
  production_or_development: ProductionOrDevelopment;
};

export type ProductionOrDevelopment = "development" | "production" | "test";
