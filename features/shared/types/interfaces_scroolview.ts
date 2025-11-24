import { ScrollView } from "react-native-gesture-handler";

export type ScrollViewRef = ScrollView & {
  flashScrollIndicators: () => void;
};
