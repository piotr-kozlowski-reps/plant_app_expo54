import { useColorScheme } from "nativewind";
import { createContext } from "react";
import { View } from "react-native";

import { themes } from "../constants/colorThemeVars";
import { TTheme } from "../types/interfaces-theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeContext = createContext<{
  theme: TTheme;
}>({
  theme: "light",
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme } = useColorScheme();
  const colorSchemeProperlyTyped = colorScheme as TTheme;

  return (
    <ThemeContext.Provider value={{ theme: colorSchemeProperlyTyped }}>
      <View style={themes[colorSchemeProperlyTyped]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
