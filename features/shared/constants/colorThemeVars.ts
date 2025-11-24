import { vars } from "nativewind";
import { configPerBuild } from "../env/env";

export const lightColor = "#E9EEEC";
export const lightNuanceColor = "#FFFDF9";
export const darkColor = "#002539";
export const yellowColor = "#F9A910";
export const yellowDarkColor = "#BC8317";
export const grayColor = "#d7d7d7";
export const grayColorPlaceholder = "#946D23";
export const destructiveColor = "#DC343C";
export const primaryColor = "#E5261D";
export const testColor = "#666";
export const greenColor = "#317F1C";

export const themes = {
  light: vars({
    "--foreground": darkColor,
    "--background": lightColor,
    "--background-nuance": lightNuanceColor,
    "--destructive": "#DC343C",
    "--gray": "#C2C2C2",
    "--gray-darker": "#B0B0B0",
    "--input": "#ff0000",
    "--primary": primaryColor,
    "--yellow": yellowColor,
    "--green": greenColor,
  }),
  dark: vars({
    "--foreground": darkColor,
    "--background": lightColor,
    "--background-nuance": lightNuanceColor,
    "--destructive": "#DC343C",
    "--gray": "#C2C2C2",
    "--gray-darker": "#B0B0B0",
    "--input": "#ff0000",
    "--primary": primaryColor,
    "--yellow": yellowColor,
    "--green": greenColor,
  }),
};
